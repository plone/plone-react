# Forms and widgets

## Single-choice field with vocabulary

If you have a fixed predefined vocabulary you can define your field such as:

```python
    legislative_reference = Choice(
            title=u"Single legislative reference",
            required=False,
            vocabulary="legislative_vocabulary",
        )
```

Volto will render this field with the `SelectWidget` widget.

## Multi-choice field with vocabulary

If you have a fixed predefined vocabulary you can define your field such as:

```python
    legislative_reference = Tuple(
        title="Legislative reference",
        value_type=Choice(
            title=u"Single legislative reference",
            required=False,
            vocabulary="legislative_vocabulary",
        ))
```

This is enough and Volto will render this field with the `ArrayWidget` widget.

## Multi-choice field with vocabulary and creatable

In the backend, in the dexterity schema, define a field such as:

```python
from plone.autoform import directives
from zope import schema

...
    directives.widget("category", vocabulary="category_vocabulary")
    category = schema.Tuple(title=u"Topic",
                     value_type=schema.TextLine(
                         title=u"Single topic",
                         required=False,
                     ))
```

Then you need to define the `category_vocabulary`:

```
from plone.app.vocabularies.catalog import KeywordsVocabulary as BKV
from zope.interface import implementer
from zope.schema.interfaces import IVocabularyFactory

@implementer(IVocabularyFactory)
class KeywordsVocabulary(BKV):
    def __init__(self, index):
        self.keyword_index = index

CategoryVocabularyFactory = KeywordsVocabulary("category")
```

Register your vocabulary in `configure.zcml`:

```
  <utility
      name="category_vocabulary"
      component=".vocabulary.CategoryVocabularyFactory"
      />
```

You'll need to define a new KeywordsIndex in `portal_catalog`, in
a `catalog.xml` GenericSetup file.

```xml
<?xml version="1.0"?>
<object name="portal_catalog">
  <index name="category" meta_type="KeywordIndex">
    <indexed_attr value="category"/>
  </index>
</object>
```

For Volto 13, you need to register the Volto widget for this field. This may
change in the future:

```
import TokenWidget from '@plone/volto/components/manage/Widgets/TokenWidget';

const applyConfig = (config) => {
  config.widgets.id.category = TokenWidget;
  return config;
}

```

Based on this setup, Volto will render this field with the `TokenWidget`.

## Write a new widget

!!! warning
    Please contribute this section!
