#!/usr/bin/env ruby

require 'json'

cwd = File.expand_path(File.dirname(__FILE__))

# Onde estão as listas de eleitos
pasta_de_entrada = File.expand_path(File.join(cwd, "eleitos"))

# Onde ficará o json
arquivo_de_saida = File.expand_path(File.join(File.dirname(cwd), "public", "eleitos.json"))


# --------------------------------------------------------
# Processa todos arquivos e carrega os totais por partido
# --------------------------------------------------------

municipais, estaduais, federais = {}, {}, {}

Dir.glob(File.join(pasta_de_entrada, "*.txt")) do |arquivo|

  IO.foreach(arquivo) do |linha|

    ano, uf, municipio, cargo, sigla = linha.chomp.split(';')

    if cargo.match(%r{\APREFEITO|VEREADOR\z})

      ((((municipais[ano] ||= {})[uf] ||= {})[municipio] ||= {})[cargo] ||= Hash.new(0))[sigla] += 1

    elsif cargo.match(%r{\AGOVERNADOR|DEPUTADO (ESTADUAL|DISTRITAL)\z})

      # Unifica DEPUTADO ESTADUAL e DEPUTADO DISTRITAL
      cargo.gsub!(%r{ESTADUAL|DISTRITAL}, "ESTADUAL OU DISTRITAL")

      (((estaduais[ano] ||= {})[uf] ||= {})[cargo] ||= Hash.new(0))[sigla] += 1

    else

      ((federais[ano] ||= {})[cargo] ||= Hash.new(0))[sigla] += 1

    end
  end
end


# -------------------------------------------------------------
# Processa totais por partido e gera com os totais necessários
# -------------------------------------------------------------

json = { m:{}, e:{}, f:{} }

municipais.each do |ano, ufs|

  json[:m][ano] = {
    total_prefeitos:              0,
    total_vereadores:             0,
    prefeitos_por_sigla:          Hash.new(0),
    peso_dos_prefeitos_por_sigla: Hash.new(0),
    vereadores_por_sigla:         Hash.new(0)
  }

  ufs.each do |uf, municipios|
    municipios.each do |municipio, cargos|

      # Ignora cidades que não tem os dados dos vereadores
      next unless cargos.has_key? 'VEREADOR'

      total_vereadores = cargos['VEREADOR'].map { |sigla, vereadores| vereadores }.reduce(:+)

      json[:m][ano][:total_prefeitos]  += 1
      json[:m][ano][:total_vereadores] += total_vereadores

      if cargos.has_key? 'PREFEITO'
        cargos['PREFEITO'].each do |sigla, prefeitos|
          json[:m][ano][:prefeitos_por_sigla][sigla]          += 1
          json[:m][ano][:peso_dos_prefeitos_por_sigla][sigla] += total_vereadores
        end
      end

      cargos['VEREADOR'].each do |sigla, vereadores|
        json[:m][ano][:vereadores_por_sigla][sigla] += vereadores
      end
    end
  end
end

estaduais.each do |ano, ufs|

  json[:e][ano] = {
    total_governadores:              0,
    total_deputados:                 0,
    governadores_por_sigla:          Hash.new(0),
    peso_dos_governadores_por_sigla: Hash.new(0),
    deputados_por_sigla:             Hash.new(0)
  }

  ufs.each do |uf, cargos|

    total_deputados = cargos['DEPUTADO ESTADUAL OU DISTRITAL'].map { |sigla, deputados| deputados }.reduce(:+)

    json[:e][ano][:total_governadores] += 1
    json[:e][ano][:total_deputados]    += total_deputados

    cargos['GOVERNADOR'].each do |sigla, governadores|
      json[:e][ano][:governadores_por_sigla][sigla]          += 1
      json[:e][ano][:peso_dos_governadores_por_sigla][sigla] += total_deputados
    end

    cargos['DEPUTADO ESTADUAL OU DISTRITAL'].each do |sigla, deputados|
      json[:e][ano][:deputados_por_sigla][sigla] += deputados
    end
  end
end

federais.each do |ano, cargos|

  json[:f][ano] = {
    total_presidentes:     1,
    total_deputados:       0,
    total_senadores:       0,
    presidentes_por_sigla: Hash.new(0),
    deputados_por_sigla:   Hash.new(0),
    senadores_por_sigla:   Hash.new(0)
  }

  json[:f][ano][:total_deputados] = cargos['DEPUTADO FEDERAL'].map { |sigla, deputados| deputados }.reduce(:+)
  json[:f][ano][:total_senadores] = cargos['SENADOR'].map { |sigla, senadores| senadores }.reduce(:+)

  cargos['PRESIDENTE'].each { |sigla, presidentes| json[:f][ano][:presidentes_por_sigla][sigla] = 1 }

  cargos['DEPUTADO FEDERAL'].each do |sigla, deputados|
    json[:f][ano][:deputados_por_sigla][sigla] += deputados
  end

  cargos['SENADOR'].each do |sigla, senadores|
    json[:f][ano][:senadores_por_sigla][sigla] += senadores
  end
end

IO.write(arquivo_de_saida, json.to_json)
