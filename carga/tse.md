# Dados do TSE


## Repositório de dados eleitorais

Dados do TSE sobre as eleições podem ser baixados no [Repositórios de dados eleitorais](http://www.tse.jus.br/hotSites/pesquisas-eleitorais/resultados.html).

Os dados de 1994 e 1996 estão faltando vários estados, portanto são inúteis para calcular a média nacional.


## Downloads


### -1990

Para as eleições até 1990, faça download de "Votação nominal por UF (formato ZIP)":

    wget http://agencia.tse.jus.br/estatistica/sead/odsele/votacao_candidato_uf/votacao_candidato_uf_1989.zip
    wget http://agencia.tse.jus.br/estatistica/sead/odsele/votacao_candidato_uf/votacao_candidato_uf_1990.zip


### 1994-

Para as eleições a partir de 1994, faça download de "Votação nominal por município e zona (formato ZIP)":

    wget http://agencia.tse.jus.br/estatistica/sead/odsele/votacao_candidato_munzona/votacao_candidato_munzona_1994.zip
    wget http://agencia.tse.jus.br/estatistica/sead/odsele/votacao_candidato_munzona/votacao_candidato_munzona_1996.zip
    wget http://agencia.tse.jus.br/estatistica/sead/odsele/votacao_candidato_munzona/votacao_candidato_munzona_1998.zip
    wget http://agencia.tse.jus.br/estatistica/sead/odsele/votacao_candidato_munzona/votacao_candidato_munzona_2000.zip
    wget http://agencia.tse.jus.br/estatistica/sead/odsele/votacao_candidato_munzona/votacao_candidato_munzona_2002.zip
    wget http://agencia.tse.jus.br/estatistica/sead/odsele/votacao_candidato_munzona/votacao_candidato_munzona_2004.zip
    wget http://agencia.tse.jus.br/estatistica/sead/odsele/votacao_candidato_munzona/votacao_candidato_munzona_2006.zip
    wget http://agencia.tse.jus.br/estatistica/sead/odsele/votacao_candidato_munzona/votacao_candidato_munzona_2008.zip
    wget http://agencia.tse.jus.br/estatistica/sead/odsele/votacao_candidato_munzona/votacao_candidato_munzona_2010.zip
    wget http://agencia.tse.jus.br/estatistica/sead/odsele/votacao_candidato_munzona/votacao_candidato_munzona_2012.zip
    wget http://agencia.tse.jus.br/estatistica/sead/odsele/votacao_candidato_munzona/votacao_candidato_munzona_2012.zip
    wget http://agencia.tse.jus.br/estatistica/sead/odsele/votacao_candidato_munzona/votacao_candidato_munzona_2014.zip


## Arquivos


### -1990

Para as eleições até 1990, o arquivo será `VOTACAO_CANDIDATO_UF_<ANO ELEIÇÃO>/VOTACAO_CANDIDATO_UF_<ANO ELEIÇÃO>_<SIGLA UF>.txt`. É um CSV que contém as seguintes colunas:

    ##   VARIÁVEL                 DESCRIÇÃO

    00   DATA_GERACAO             Data de geração do arquivo (data da extração)
    01   HORA_GERACAO             Hora de geração do arquivo (hora da extração) - Horário de Brasília
    02   ANO_ELEICAO              Ano da eleição
    03   NUM_TURNO (*)            Número do turno
    04   DESCRICAO_ELEICAO (*)    Descrição da eleição
    05   SIGLA_UF                 Sigla da Unidade da Federação em que ocorreu a eleição
    06   SIGLA_UE (*)             Sigla da Unidade Eleitoral (Em caso de eleição majoritária é a sigla da UF que o candidato concorre (texto) e em caso de eleição municipal é o código TSE do município (número)). Assume os valores especiais BR, ZZ e VT para designar, respectivamente, o Brasil, Exterior e Voto em Trânsito
    07   CODIGO_CARGO (*)         Código do cargo a que o candidato concorre
    08   NUMERO_CAND (*)          Número do candidato na urna
    09   SQ_CANDIDATO (*)         Número sequencial do candidato gerado internamente pelos sistemas eleitorais. Não é o número de campanha do candidato.
    10   NOME_CANDIDATO           Nome completo do candidato
    11   NOME_URNA_CANDIDATO      Nome de urna do candidato
    12   DESCRICAO_CARGO          Descrição do cargo a que o candidato concorre
    13   COD_SIT_CAND_SUPERIOR    Código da situação de totalização do candidato superior naquele turno. Esta variável deve ser considerada apenas quando o cargo do candidato for vice ou suplente.
    14   DESC_SIT_CAND_SUPERIOR   Descrição da situação de totalização do candidato superior naquele turno. Esta variável deve ser considerada apenas quando o cargo do candidato for vice ou suplente.
    15   CODIGO_SIT_CANDIDATO     Código da situação do registro de candidatura do candidato
    16   DESC_SIT_CANDIDATO       Descrição da situação de registro de candidatura do candidato
    17   CODIGO_SIT_CAND_TOT      Código da situação de totalização do candidato naquele turno
    18   DESC_SIT_CAND_TOT        Descrição da situação de totalização do candidato naquele turno
    19   NUMERO_PARTIDO           Número do partido
    20   SIGLA_PARTIDO            Sigla do partido
    21   NOME_PARTIDO             Nome do partido
    22   SEQUENCIAL_LEGENDA       Código sequencial da legenda gerado pela Justiça Eleitoral
    23   NOME_COLIGACAO           Nome da legenda
    24   COMPOSICAO_LEGENDA       Composição da legenda
    25   TOTAL_VOTOS              Quantidade de votos nominais totalizados para aquele candidato naquela unidade da federação.


### 1994-2012

Para as eleições a partir de 1994, o arquivo será `votacao_candidato_munzona_<ANO ELEIÇÃO>/votacao_candidato_munzona_<ANO ELEIÇÃO>_<SIGLA UF>.txt`. É um CSV que contém as seguintes colunas:

    ##   VARIÁVEL                 DESCRIÇÃO

    00   DATA_GERACAO             Data de geração do arquivo (data da extração)
    01   HORA_GERACAO             Hora de geração do arquivo (hora da extração) - Horário de Brasília
    02   ANO_ELEICAO              Ano da eleição
    03   NUM_TURNO (*)            Número do turno
    04   DESCRICAO_ELEICAO (*)    Descrição da eleição
    05   SIGLA_UF                 Sigla da Unidade da Federação em que ocorreu a eleição
    06   SIGLA_UE (*)             Sigla da Unidade Eleitoral (Em caso de eleição majoritária é a sigla da UF que o candidato concorre (texto) e em caso de eleição municipal é o código TSE do município (número)). Assume os valores especiais BR, ZZ e VT para designar, respectivamente, o Brasil, Exterior e Voto em Trânsito
    07   CODIGO_MUNICIPIO (*)     Código TSE do município onde ocorreu a eleição
    08   NOME_MUNICIPIO           Nome do município onde ocorreu a eleição
    09   NUMERO_ZONA (*)          Número da Zona Eleitoral
    10   CODIGO_CARGO (*)         Código do cargo a que o candidato concorre
    11   NUMERO_CAND (*)          Número do candidato na urna
    12   SQ_CANDIDATO (*)         Número sequencial do candidato gerado internamente pelos sistemas eleitorais. Não é o número de campanha do candidato.
    13   NOME_CANDIDATO           Nome completo do candidato
    14   NOME_URNA_CANDIDATO      Nome de urna do candidato
    15   DESCRICAO_CARGO          Descrição do cargo a que o candidato concorre
    16   COD_SIT_CAND_SUPERIOR    Código da situação de totalização do candidato superior naquele turno. Esta variável deve ser considerada apenas quando o cargo do candidato for vice ou suplente.
    17   DESC_SIT_CAND_SUPERIOR   Descrição da situação de totalização do candidato superior naquele turno. Esta variável deve ser considerada apenas quando o cargo do candidato for vice ou suplente.
    18   CODIGO_SIT_CANDIDATO     Código da situação do registro de candidatura do candidato
    19   DESC_SIT_CANDIDATO       Descrição da situação de registro de candidatura do candidato
    20   CODIGO_SIT_CAND_TOT      Código da situação de totalização do candidato naquele turno
    21   DESC_SIT_CAND_TOT        Descrição da situação de totalização do candidato naquele turno
    22   NUMERO_PARTIDO           Número do partido
    23   SIGLA_PARTIDO            Sigla do partido
    24   NOME_PARTIDO             Nome do partido
    25   SEQUENCIAL_LEGENDA       Código sequencial da legenda gerado pela Justiça Eleitoral
    26   NOME_COLIGACAO           Nome da legenda
    27   COMPOSICAO_LEGENDA       Composição da legenda
    28   TOTAL_VOTOS              Quantidade de votos nominais totalizados para aquele candidato naquele município e zona


### 2014-

Mesmo que 1994-2012, mas com uma coluna adicional no final:

    29   TRANSITO                 Informa se o registro se refere ou não a Voto em Trânsito
