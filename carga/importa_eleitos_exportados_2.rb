#!/usr/bin/env ruby

# http://inter04.tse.jus.br/ords/dwtse/f?p=1945:2:3073111975378812::NO:RP:P0_HID_MOSTRA%2CP0_SLS_DS_CARGO%2CP0_SLS_NR_ANO%2CP0_SLS_SG_PARTIDO%2CP0_SLS_SG_UF%2CP0_TXT_NM_CANDIDATO:N%2C%27TODOS%27%2C%27TODOS%27%2C%27TODOS%27%2C%27TODAS%27%2C

ano = 1990

require 'set'
require 'fileutils'

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
  "PDS"   => 11,
  "PDT"   => 12,
  "PT"    => 13,
  "PTB"   => 14,
  "PMDB"  => 15,
  "PDC"   => 17,
  "PSC"   => 20,
  "PL"    => 22,
  "PCB"   => 23,
  "PFL"   => 25,
  "PTR"   => 28,
  "PCN"   => 31,
  "PMN"   => 33,
  "PRN"   => 36,
  "PSB"   => 40,
  "PSD"   => 41,
  "PRP"   => 44,
  "PSDB"  => 45,
  "PST"   => 52,
  "PSL"   => 59,
  "PCDOB" => 65,
  "PNT"   => 67,
  "PRS"   => 71,
}

linhas = IO.readlines(arquivo_de_entrada).uniq.map do |linha|
  nome_e_cargo, uf, sigla = linha.chomp.split(';')

  nome, cargo = nome_e_cargo.split(' - ')
  numero = tabela_de_partidos[sigla]

  unless tabela_de_partidos.has_key? sigla
    puts sigla
    exit
  end

  sigla = 'PC do B' if sigla == 'PCDOB'

  [ ano.to_s, uf, '', cargo, numero.to_s, sigla, nome ]
end

linhas.each do |linha|
  partido = [ linha[0], linha[4], linha[5], "-" ]
  partidos << partido
end
IO.write(File.join(cwd, "partidos.txt"), partidos.map { |l| l.join(";") }.join("\n"))

ufs.each do |uf|

  arquivo_de_saida = File.join(pasta_de_saida, "#{ano}_#{uf.downcase}.txt")

  filtrados_por_uf = linhas.select { |linha| linha[1] == uf }.sort

  IO.write(arquivo_de_saida, filtrados_por_uf.map { |l| l.join(";") }.join("\n"))
end
