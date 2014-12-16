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

    ano, uf, municipio, cargo, numero, sigla, nome = linha.chomp.split(';')

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

json = { municipais:{}, estaduais:{}, federais:{} }

municipais.each do |ano, ufs|

  json[:municipais][ano] = {
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

      json[:municipais][ano][:total_prefeitos]  += 1
      json[:municipais][ano][:total_vereadores] += total_vereadores

      if cargos.has_key? 'PREFEITO'
        cargos['PREFEITO'].each do |sigla, prefeitos|
          json[:municipais][ano][:prefeitos_por_sigla][sigla]          += 1
          json[:municipais][ano][:peso_dos_prefeitos_por_sigla][sigla] += total_vereadores
        end
      end

      cargos['VEREADOR'].each do |sigla, vereadores|
        json[:municipais][ano][:vereadores_por_sigla][sigla] += vereadores
      end
    end
  end
end

estaduais.each do |ano, ufs|

  json[:estaduais][ano] = {
    total_governadores:              0,
    total_deputados_estaduais:       0,
    governadores_por_sigla:          Hash.new(0),
    peso_dos_governadores_por_sigla: Hash.new(0),
    deputados_estaduais_por_sigla:   Hash.new(0)
  }

  ufs.each do |uf, cargos|

    total_deputados_estaduais = cargos['DEPUTADO ESTADUAL OU DISTRITAL'].map { |sigla, deputados_estaduais| deputados_estaduais }.reduce(:+)

    json[:estaduais][ano][:total_governadores]        += 1
    json[:estaduais][ano][:total_deputados_estaduais] += total_deputados_estaduais

    cargos['GOVERNADOR'].each do |sigla, governadores|
      json[:estaduais][ano][:governadores_por_sigla][sigla]          += 1
      json[:estaduais][ano][:peso_dos_governadores_por_sigla][sigla] += total_deputados_estaduais
    end

    cargos['DEPUTADO ESTADUAL OU DISTRITAL'].each do |sigla, deputados_estaduais|
      json[:estaduais][ano][:deputados_estaduais_por_sigla][sigla] += deputados_estaduais
    end
  end
end

federais.each do |ano, cargos|

  json[:federais][ano] = {
    total_presidentes:            1,
    total_deputados_federais:     0,
    total_senadores:              0,
    presidentes_por_sigla:        Hash.new(0),
    deputados_federais_por_sigla: Hash.new(0),
    senadores_por_sigla:          Hash.new(0)
  }

  json[:federais][ano][:total_deputados_federais] = cargos['DEPUTADO FEDERAL'].map { |sigla, deputados_federais| deputados_federais }.reduce(:+)
  json[:federais][ano][:total_senadores] = cargos['SENADOR'].map { |sigla, senadores| senadores }.reduce(:+)

  cargos['PRESIDENTE'].each { |sigla, presidentes| json[:federais][ano][:presidentes_por_sigla][sigla] = 1 }

  cargos['DEPUTADO FEDERAL'].each do |sigla, deputados_federais|
    json[:federais][ano][:deputados_federais_por_sigla][sigla] += deputados_federais
  end

  cargos['SENADOR'].each do |sigla, senadores|
    json[:federais][ano][:senadores_por_sigla][sigla] += senadores
  end
end

IO.write(arquivo_de_saida, json.to_json)
