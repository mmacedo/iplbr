#!/usr/bin/env ruby

# http://www.tse.jus.br/eleicoes/eleicoes-anteriores/eleicoes-1996/resultados-das-eleicoes

require 'set'
require 'fileutils'

cwd = File.expand_path(File.dirname(__FILE__))

# Onde está a lista de eleitos
arquivo_de_entrada = File.expand_path("~/Downloads/eleitos1996.csv")

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
  "PPB"     => 11,
  "PDT"     => 12,
  "PT"      => 13,
  "PTB"     => 14,
  "PMDB"    => 15,
  "PSL"     => 17,
  "PST"     => 18,
  "PTN"     => 19,
  "PSC"     => 20,
  "PL"      => 22,
  "PPS"     => 23,
  "PFL"     => 25,
  "PAN"     => 26,
  "PRTB"    => 28,
  "PGT"     => 30,
  "PSN"     => 31,
  "PMN"     => 33,
  "PRN"     => 36,
  "PSB"     => 40,
  "PV"      => 43,
  "PRP"     => 44,
  "PSD"     => 41,
  "PSDB"    => 45,
  "PSDC"    => 27,
  "PC do B" => 65,
  "PT do B" => 70
}

linhas = IO.readlines(arquivo_de_entrada).map do |linha|
  cargo, uf, municipio, sigla, nome = linha.chomp.split(',')

  numero = tabela_de_partidos[sigla]

  puts sigla unless tabela_de_partidos.has_key? sigla

  [ "1996", uf, municipio, cargo.upcase, numero.to_s, sigla, nome ]
end

linhas.each do |linha|
  partido = [ linha[0], linha[4], linha[5], "-" ]
  partidos << partido
end
IO.write(File.join(cwd, "partidos.txt"), partidos.map { |l| l.join(";") }.join("\n"))

ufs.each do |uf|
  visao = linhas.select { |linha| linha[1] == uf }.sort
  IO.write(File.join(pasta_de_saida, "1996_#{uf.downcase}.txt"), visao.map { |l| l.join(";") }.join("\n"))
end
