#!/usr/bin/env ruby

require 'roo'
require 'fileutils'

cwd = File.expand_path(File.dirname(__FILE__))

# Onde estão as pastas já extraídas
pasta_de_download = File.expand_path("~/Downloads/ibge")

# Onde ficarão os novos arquivos com lista de eleitos
pasta_de_saida    = File.join(cwd, "populacao")
FileUtils.mkdir_p(pasta_de_saida)

[
  { ano: 1992, planilha: 0, ignora_no_inicio: 2, cidades: 4974 },
  { ano: 1993, planilha: 0, ignora_no_inicio: 2, cidades: 4974 },
  { ano: 1994, planilha: 0, ignora_no_inicio: 2, cidades: 4974 },
  { ano: 1995, planilha: 0, ignora_no_inicio: 2, cidades: 4974 },
  { ano: 1997, planilha: 0, ignora_no_inicio: 2, cidades: 5507 },
  { ano: 1998, planilha: 0, ignora_no_inicio: 2, cidades: 5507 },
  { ano: 1999, planilha: 0, ignora_no_inicio: 2, cidades: 5507 },
  { ano: 2001, planilha: 0, ignora_no_inicio: 5, cidades: 5560 },
  { ano: 2002, planilha: 0, ignora_no_inicio: 6, cidades: 5560 },
  { ano: 2003, planilha: 0, ignora_no_inicio: 5, cidades: 5560 },
  { ano: 2004, planilha: 0, ignora_no_inicio: 5, cidades: 5564 },
  { ano: 2005, planilha: 0, ignora_no_inicio: 5, cidades: 5564 },
  { ano: 2006, planilha: 0, ignora_no_inicio: 5, cidades: 5564 },
  { ano: 2008, planilha: 0, ignora_no_inicio: 3, cidades: 5565 }, # São 5 linhas
  { ano: 2009, planilha: 0, ignora_no_inicio: 5, cidades: 5565 },
  { ano: 2011, planilha: 0, ignora_no_inicio: 2, cidades: 5565 }, # São 3 linhas
  { ano: 2012, planilha: 0, ignora_no_inicio: 2, cidades: 5565 }, # São 3 linhas
  { ano: 2013, planilha: 0, ignora_no_inicio: 2, cidades: 5570 }, # São 3 linhas
  { ano: 2014, planilha: 1, ignora_no_inicio: 2, cidades: 5570 } # São 3 linhas
].each do |x|
  planilha   = Roo::Openoffice.new(File.join(pasta_de_download, "#{x[:ano]}.ods"))
  coluna_uf  = planilha.sheet(x[:planilha]).column(1).drop(x[:ignora_no_inicio]).take(x[:cidades])
  coluna_mun = planilha.sheet(x[:planilha]).column(4).drop(x[:ignora_no_inicio]).take(x[:cidades])
  coluna_pop = planilha.sheet(x[:planilha]).column(5).drop(x[:ignora_no_inicio]).take(x[:cidades]).map(&:to_i)
  dados_muns = coluna_uf.zip(coluna_mun, coluna_pop)
  dados_ufs  = dados_muns.group_by(&:first).each_pair.map { |uf, linhas| [ uf, linhas.map { |linha| linha[2] }.reduce(:+) ] }
  IO.write(File.join(pasta_de_saida, "#{x[:ano]}_municipios.txt"), dados_muns.map { |l| l.join(";") }.join("\n"))
  IO.write(File.join(pasta_de_saida, "#{x[:ano]}_ufs.txt"), dados_ufs.map { |l| l.join(";") }.join("\n"))
end
