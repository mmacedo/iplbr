# Dados do IBGE


## Estimativas de População

Estimativas populacionais por estado e por município podem ser baixados na seção de [Estimativas de População](http://www.ibge.gov.br/home/estatistica/populacao/estimativa2014/default.shtm).

## Downloads

### 1992-1995, 1997-1999, 2001-2006, 2008-2009, 2011-2014

Realizar download:

    wget http://servicodados.ibge.gov.br/Download/Download.ashx\?u=ftp.ibge.gov.br//Estimativas_de_Populacao/Estimativas_1992/estimativa_populacao_1992_ods.zip -O tmp.zip; and unzip tmp.zip; and rm tmp.zip; and mv estimativa_populacao_1992.ods 1992.ods
    wget http://servicodados.ibge.gov.br/Download/Download.ashx\?u=ftp.ibge.gov.br//Estimativas_de_Populacao/Estimativas_1993/estimativa_populacao_1993_ods.zip -O tmp.zip; and unzip tmp.zip; and rm tmp.zip; and mv estimativa_populacao_1993.ods 1993.ods
    wget http://servicodados.ibge.gov.br/Download/Download.ashx\?u=ftp.ibge.gov.br//Estimativas_de_Populacao/Estimativas_1994/estimativa_populacao_1994_ods.zip -O tmp.zip; and unzip tmp.zip; and rm tmp.zip; and mv estimativa_populacao_1994.ods 1994.ods
    wget http://servicodados.ibge.gov.br/Download/Download.ashx\?u=ftp.ibge.gov.br//Estimativas_de_Populacao/Estimativas_1995/estimativa_populacao_1995_ods.zip -O tmp.zip; and unzip tmp.zip; and rm tmp.zip; and mv estimativa_populacao_1995.ods 1995.ods
    wget http://servicodados.ibge.gov.br/Download/Download.ashx\?u=ftp.ibge.gov.br//Estimativas_de_Populacao/Estimativas_1997/estimativa_populacao_1997_ods.zip -O tmp.zip; and unzip tmp.zip; and rm tmp.zip; and mv estimativa_populacao_1997.ods 1997.ods
    wget http://servicodados.ibge.gov.br/Download/Download.ashx\?u=ftp.ibge.gov.br//Estimativas_de_Populacao/Estimativas_1998/estimativa_populacao_1998_ods.zip -O tmp.zip; and unzip tmp.zip; and rm tmp.zip; and mv estimativa_populacao_1998.ods 1998.ods
    wget http://servicodados.ibge.gov.br/Download/Download.ashx\?u=ftp.ibge.gov.br//Estimativas_de_Populacao/Estimativas_1999/estimativa_populacao_1999_ods.zip -O tmp.zip; and unzip tmp.zip; and rm tmp.zip; and mv estimativa_populacao_1999.ods 1999.ods
    wget http://servicodados.ibge.gov.br/Download/Download.ashx\?u=ftp.ibge.gov.br//Estimativas_de_Populacao/Estimativas_2001/UF_Municipio.zip -O tmp.zip; and unzip tmp.zip; and rm tmp.zip; and mv UF_Municipio.xls 2001.xls
    wget http://servicodados.ibge.gov.br/Download/Download.ashx\?u=ftp.ibge.gov.br//Estimativas_de_Populacao/Estimativas_2002/UF_Municipio.zip -O tmp.zip; and unzip tmp.zip; and rm tmp.zip; and mv POP-2002-DOU.xls 2002.xls
    wget http://servicodados.ibge.gov.br/Download/Download.ashx\?u=ftp.ibge.gov.br//Estimativas_de_Populacao/Estimativas_2003/UF_Municipio.zip -O tmp.zip; and unzip tmp.zip; and rm tmp.zip; and mv POP-2003-TCU.xls 2003.xls
    wget http://servicodados.ibge.gov.br/Download/Download.ashx\?u=ftp.ibge.gov.br//Estimativas_de_Populacao/Estimativas_2004/UF_Municipio.zip -O tmp.zip; and unzip tmp.zip; and rm tmp.zip; and mv POP2004-TCU.xls 2004.xls
    wget http://servicodados.ibge.gov.br/Download/Download.ashx\?u=ftp.ibge.gov.br//Estimativas_de_Populacao/Estimativas_2005/UF_Municipio.zip -O tmp.zip; and unzip tmp.zip; and rm tmp.zip; and mv POP-2005-DOU.xls 2005.xls
    wget http://servicodados.ibge.gov.br/Download/Download.ashx\?u=ftp.ibge.gov.br//Estimativas_de_Populacao/Estimativas_2006/UF_Municipio.zip -O tmp.zip; and unzip tmp.zip; and rm tmp.zip; and mv POP2006-TCU.xls 2006.xls
    wget ftp://ftp.ibge.gov.br/Estimativas_de_Populacao/Estimativas_2008/UF_Municipio.zip -O tmp.zip; and unzip tmp.zip; and rm tmp.zip; and mv POP2008_DOU.xls 2008.xls
    wget ftp://ftp.ibge.gov.br/Estimativas_de_Populacao/Estimativas_2009/UF_Municipio.zip -O tmp.zip; and unzip tmp.zip; and rm tmp.zip; and mv UF_Municipio.xls 2009.xls
    wget ftp://ftp.ibge.gov.br/Estimativas_de_Populacao/Estimativas_2011/POP2011_DOU.zip -O tmp.zip; and unzip tmp.zip; and rm tmp.zip; and mv POP2011_DOU.xls 2011.xls
    wget ftp://ftp.ibge.gov.br/Estimativas_de_Populacao/Estimativas_2012/estimativa_2012_DOU_28_08_2012_ods.zip -O tmp.zip; and unzip tmp.zip; and rm tmp.zip; and mv estimativa_2012_DOU_28_08_2012_ods.ods 2012.ods
    wget ftp://ftp.ibge.gov.br/Estimativas_de_Populacao/Estimativas_2013/estimativa_2013_dou_ods.zip -O tmp.zip; and unzip tmp.zip; and rm tmp.zip; and mv estimativa_2013_dou_ods.ods 2013.ods
    wget ftp://ftp.ibge.gov.br/Estimativas_de_Populacao/Estimativas_2014/estimativa_dou_2014_ods.zip -O tmp.zip; and unzip tmp.zip; and rm tmp.zip; and mv estimativas_dou_2014_ods.ods 2014.ods

    # This was not working, I had to do it manually
    localc --headless --convert-to ods {2001,2002,2003,2004,2005,2006,2008,2009,2011}.xls; and rm {2001,2002,2003,2004,2005,2006,2008,2009,2011}.xls

Os arquivos são bastante irregulares, é necessário fazer a importação manualmente.
