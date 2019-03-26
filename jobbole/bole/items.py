# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

import scrapy
class BoleItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass


class JobboleItem(scrapy.Item):
    title =scrapy.Field()

    def execute_data_sql(self):
        sql='insert into bole_test(title) values(%s)'
        data = (self['title'])

        return (sql,data)