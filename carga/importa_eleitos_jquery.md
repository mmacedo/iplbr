- Acesse: https://pt.wikipedia.org/wiki/Elei%C3%A7%C3%B5es_estaduais_em_Alagoas_em_1994
- Mude o 'id' para 'a' da tabela que você deseja importar
- Cole o script abaixo no Console mudando apenas a sigla da UF

Obs.: Esse tem NOME_URNA_CANDIDATO

    copy($('#a tr:gt(0)').get().map(function(tr) { return [ 1994, 'TO', '', $('#a tr:nth(0) td:nth(0)').text().toUpperCase().replace(' ELEITO', ''), {PPR:11,PDT:12,PT:13,PTB:14,PMDB:15,PTRB:17,PSC:20,PL:22,PPS:23,PFL:25,PMN:33,PRN:36,PP:39,PSB:40,PV:43,PRP:44,PSD:41,PSDB:45,PRONA:56,"PC DO B":65}[$(tr).children(':nth(1)').text().replace(/PC ?DO ?B/i, 'PC do B')], $(tr).children(':nth(1)').text().replace(/PC ?DO ?B/i, 'PC do B'), $(tr).children(':nth(0)').text().toUpperCase().replace(/\[[0-9]+\]$/, '') ].join(";"); }).sort().join("\n"));

Outro possível formato.

    copy($('#a tr:gt(0)').get().map(function(tr) { return [ 1994, 'TO', '', "CARGOOOO", {PPR:11,PDT:12,PT:13,PTB:14,PMDB:15,PTRB:17,PSC:20,PL:22,PPS:23,PFL:25,PMN:33,PRN:36,PP:39,PSB:40,PV:43,PRP:44,PSD:41,PSDB:45,PRONA:56,"PC DO B":65}[$(tr).children(':nth(1)').text().replace(/PC ?DO ?B/i, 'PC do B')], $(tr).children(':nth(1)').text().replace(/PC ?DO ?B/i, 'PC do B'), $(tr).children(':nth(0)').text().toUpperCase().replace(/\[[0-9]+\]$/, '') ].join(";"); }).sort().join("\n"));


- Se não estiver disponível, acesse: http://www.tse.jus.br/eleicoes/eleicoes-anteriores/eleicoes-1994/resultados-das-eleicoes-1994/amazonas/resultados-das-eleicoes-1994-amazonas-deputado-estadual
- Cole o script abaixo no Console mudando apenas a sigla da UF

Obs.: Esse não tem NOME_URNA_CANDIDATO

    copy($('.grid:first tr:gt(1)').get().map(function(tr) { return [ 1994, 'TO', '', $('#tituloInterno h2').text().replace(/.*\- /, '').toUpperCase(), {PPR:11,PDT:12,PT:13,PTB:14,PMDB:15,PTRB:17,PSC:20,PL:22,PPS:23,PFL:25,PMN:33,PRN:36,PP:39,PSB:40,PV:43,PRP:44,PSD:41,PSDB:45,PRONA:56,"PC DO B":65}[$(tr).children(':nth(1)').text()], $(tr).children(':nth(1)').text(), $(tr).children(':nth(0)').text().toUpperCase().replace(/^[0-9]+ /, '') ].join(";"); }).sort().join("\n"));
