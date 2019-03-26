# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class GushiwenItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    id = scrapy.Field()
    author = scrapy.Field()
    author_desc = scrapy.Field()
    head_img = scrapy.Field()
    era = scrapy.Field()
    idnew = scrapy.Field()
    sumPage = scrapy.Field()

    title = scrapy.Field()
    content = scrapy.Field()
    category = scrapy.Field()
    notes = scrapy.Field()
    explanation = scrapy.Field()
    appreciation = scrapy.Field()
    name = scrapy.Field()

