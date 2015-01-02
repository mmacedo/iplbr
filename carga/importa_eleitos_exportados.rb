#!/usr/bin/env ruby

# http://www.tse.jus.br/eleicoes/eleicoes-anteriores/eleicoes-1996/resultados-das-eleicoes

ano = 2008

require 'set'
require 'fileutils'
require 'unicode'

cwd = File.expand_path(File.dirname(__FILE__))

# Onde está a lista de eleitos
arquivo_de_entrada = File.expand_path("~/Downloads/eleitos#{ano}.csv")

# Onde ficarão os novos arquivos com lista de eleitos
pasta_de_saida    = File.join(cwd, "eleitos")
FileUtils.mkdir_p(pasta_de_saida)

# Faz carga de partidos em paralelo
ja_carregados = IO.readlines(File.join(cwd, "partidos.txt")).map { |linha| linha.chomp.split(';') }
partidos = SortedSet.new(ja_carregados.to_a)
# partidos = SortedSet.new

# Quais arquivos extrair
ufs = %w{ AC AL AM AP BA CE DF ES GO MA MG MS MT PA PB PE PI PR RJ RN RO RR RS SC SE SP TO }

tabela_de_partidos = {
  '1996' => {
    "PPB"     => 11,
    "PDT"     => 12,
    "PT"      => 13,
    "PTB"     => 14,
    "PMDB"    => 15,
    "PSTU"    => 16,
    "PSL"     => 17,
    "PST"     => 18,
    "PTN"     => 19,
    "PSC"     => 20,
    "PL"      => 22,
    "PPS"     => 23,
    "PFL"     => 25,
    "PAN"     => 26,
    "PSDC"    => 27,
    "PRTB"    => 28,
    "PCO"     => 29,
    "PSN"     => 31,
    "PMN"     => 33,
    "PRN"     => 36,
    "PSB"     => 40,
    "PSD"     => 41,
    "PV"      => 43,
    "PRP"     => 44,
    "PSDB"    => 45,
    "PRONA"   => 56,
    "PC do B" => 65,
    "PT do B" => 70
  }, '2000' => {
    "PPB"     => 11,
    "PDT"     => 12,
    "PT"      => 13,
    "PTB"     => 14,
    "PMDB"    => 15,
    "PSTU"    => 16,
    "PSL"     => 17,
    "PST"     => 18,
    "PTN"     => 19,
    "PSC"     => 20,
    "PCB"     => 21,
    "PL"      => 22,
    "PPS"     => 23,
    "PFL"     => 25,
    "PAN"     => 26,
    "PSDC"    => 27,
    "PRTB"    => 28,
    "PCO"     => 29,
    "PGT"     => 30,
    "PHS"     => 31,
    "PMN"     => 33,
    "PRN"     => 36,
    "PSB"     => 40,
    "PV"      => 43,
    "PRP"     => 44,
    "PSD"     => 41,
    "PSDB"    => 45,
    "PRONA"   => 56,
    "PC do B" => 65,
    "PT do B" => 70
  }, '2004' => {
    "PP"      => 11,
    "PDT"     => 12,
    "PT"      => 13,
    "PTB"     => 14,
    "PMDB"    => 15,
    "PSTU"    => 16,
    "PSL"     => 17,
    "PST"     => 18,
    "PTN"     => 19,
    "PSC"     => 20,
    "PCB"     => 21,
    "PL"      => 22,
    "PPS"     => 23,
    "PFL"     => 25,
    "PAN"     => 26,
    "PSDC"    => 27,
    "PRTB"    => 28,
    "PCO"     => 29,
    "PGT"     => 30,
    "PHS"     => 31,
    "PMN"     => 33,
    "PTC"     => 36,
    "PSB"     => 40,
    "PV"      => 43,
    "PRP"     => 44,
    "PSDB"    => 45,
    "PRONA"   => 56,
    "PC do B" => 65,
    "PT do B" => 70
  }, '2008' => {
    "PRB"     => 10,
    "PP"      => 11,
    "PDT"     => 12,
    "PT"      => 13,
    "PTB"     => 14,
    "PMDB"    => 15,
    "PSTU"    => 16,
    "PSL"     => 17,
    "PTN"     => 19,
    "PSC"     => 20,
    "PCB"     => 21,
    "PR"      => 22,
    "PPS"     => 23,
    "DEM"     => 25,
    "PSDC"    => 27,
    "PRTB"    => 28,
    "PCO"     => 29,
    "PGT"     => 30,
    "PHS"     => 31,
    "PMN"     => 33,
    "PTC"     => 36,
    "PSB"     => 40,
    "PV"      => 43,
    "PRP"     => 44,
    "PSDB"    => 45,
    "PSOL"    => 50,
    "PC do B" => 65,
    "PT do B" => 70
  }
}

linhas = IO.readlines(arquivo_de_entrada).uniq.map do |linha|
  cargo, uf, municipio, sigla, nome = linha.chomp.split(',')

  sigla = 'PPB' if sigla == 'PP' and ano == 2000
  nome = Unicode::upcase(nome)
  numero = tabela_de_partidos[ano.to_s][sigla]

  unless tabela_de_partidos[ano.to_s].has_key? sigla
    puts sigla
    exit
  end

  [ ano.to_s, uf, municipio, cargo.upcase, numero.to_s, sigla, nome ]
end

linhas.each do |linha|
  partido = [ linha[0], linha[4], linha[5], "-" ]
  partidos << partido
end
IO.write(File.join(cwd, "partidos.txt"), partidos.map { |l| l.join(";") }.join("\n"))

ufs.each do |uf|

  arquivo_de_saida = File.join(pasta_de_saida, "#{ano}_#{uf.downcase}.txt")

  original = IO.readlines(arquivo_de_saida).map { |linha| linha.chomp.split(';') }
  novo     = linhas.select { |linha| linha[1] == uf }.sort

  original_municipios = original.group_by { |linha| linha[2] }
  novo_municipios     = novo.group_by { |linha| linha[2] }

  novo_municipios.keys.each do |municipio|

    if original_municipios.has_key? municipio

      vereadores_original = original_municipios[municipio].select { |m| m[3] == 'VEREADOR' }
      vereadores_novo     = novo_municipios[municipio].select { |m| m[3] == 'VEREADOR' }

      prefeitos_original = original_municipios[municipio].select { |m| m[3] == 'PREFEITO' }
      prefeitos_novo     = novo_municipios[municipio].select { |m| m[3] == 'PREFEITO' }

      if vereadores_original.count != vereadores_novo.count
        puts "Subtituindo vereadores de '#{municipio}' - #{uf} (de #{vereadores_original.count.to_s.rjust(2)} para #{vereadores_novo.count.to_s.rjust(2)})"

        original_por_partido = vereadores_original.group_by { |x| x[5] }
        novo_por_partido     = vereadores_novo.group_by { |x| x[5] }

        novo_por_partido.keys.each do |sigla|
          if (!original_por_partido.has_key?(sigla)) or novo_por_partido[sigla].count != original_por_partido[sigla].count
            original_por_partido[sigla] = novo_por_partido[sigla]
          end
        end

        vereadores_original = original_por_partido.values.reduce(:+)
      end

      if prefeitos_original.count != prefeitos_novo.count
        puts "Adicionando prefeito de '#{municipio}' - #{uf} (de #{prefeitos_original.count.to_s} para #{prefeitos_novo.count.to_s})"
        prefeitos_original = prefeitos_novo
      end

      original_municipios[municipio] = prefeitos_original + vereadores_original

    else

      puts "Adicionando '#{municipio}' - #{uf}"
      original_municipios[municipio] = novo_municipios[municipio]

    end

  end

  novo = original_municipios.values.reduce(:+) || []

  IO.write(arquivo_de_saida, novo.sort.map { |l| l.join(";") }.join("\n"))
end
