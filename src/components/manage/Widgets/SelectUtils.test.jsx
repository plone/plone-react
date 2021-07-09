import { normalizeValue } from './SelectUtils';

describe('normalizeValue', () => {
  it('Given an object/object, p.restapi title/token', () => {
    // choices in Vocabulary based selects that has choices and spects a string in return
    // Use case: Language select - A Choice schema that spects a string as value
    //   language = schema.Choice(
    //     title=_(u'label_language', default=u'Language'),
    //     vocabulary='plone.app.vocabularies.SupportedContentLanguages',
    //     required=False,
    //     missing_value='',
    //     defaultFactory=default_language,
    // )
    // p.restapi vocab endpoint outputs
    // "items": [{title: "English", token: "en"}, ...]
    // If value is an object, it returns correctly
    const choices = [
      { label: 'English', value: 'en' },
      { label: 'Catala', value: 'ca' },
    ];
    const value = { title: 'English', token: 'en' };
    expect(normalizeValue(choices, value)).toStrictEqual({
      label: 'English',
      value: 'en',
    });
  });

  it('Given a object/string, p.restapi title/token', () => {
    // choices in Vocabulary based selects that has choices and spects a string in return
    // Use case: Language select - A Choice schema that spects a string as value
    //   language = schema.Choice(
    //     title=_(u'label_language', default=u'Language'),
    //     vocabulary='plone.app.vocabularies.SupportedContentLanguages',
    //     required=False,
    //     missing_value='',
    //     defaultFactory=default_language,
    // )
    // p.restapi vocab endpoint outputs
    // "items": [{title: "English", token: "en"}, ...]
    // The widget sends a string as value in the PATCH/POST:
    // value: "en"
    const choices = [
      { label: 'English', value: 'en' },
      { label: 'Catala', value: 'ca' },
    ];
    const value = 'en';
    expect(normalizeValue(choices, value)).toStrictEqual({
      label: 'English',
      value: 'en',
    });
  });

  it('Given a p.restapi array of arrays/string (SimpleVocabulary/SimpleTerm) I', () => {
    // Simplest example in Plone - a "hardcoded, hand made" vocab using SimpleVocabulary/SimpleTerm
    // allow_discussion = schema.Choice(
    //     title=_(u'Allow discussion'),
    //     description=_(u'Allow discussion for this content object.'),
    //     vocabulary=SimpleVocabulary([
    //       SimpleTerm(value=True, title=_(u'Yes')),
    //       SimpleTerm(value=False, title=_(u'No')),
    //     ]),
    //     required=False,
    //     default=None,
    // )
    // p.restapi vocab endpoint outputs an array of arrays T_T
    // choices: [
    //  ["True", "Yes"],
    //  ["False","No"]
    // ]
    const choices = [
      ['True', 'Yes'],
      ['False', 'No'],
    ];
    const value = 'True';
    expect(normalizeValue(choices, value)).toStrictEqual({
      label: 'Yes',
      value: 'True',
    });
  });

  it('Given a p.restapi array of arrays/string (SimpleVocabulary/SimpleTerm) II', () => {
    const choices = [
      ['True', 'Yes'],
      ['False', 'No'],
    ];
    const value = 'False';
    expect(normalizeValue(choices, value)).toStrictEqual({
      label: 'No',
      value: 'False',
    });
  });

  it('Given a p.restapi array of arrays/string (SimpleVocabulary/SimpleTerm) III', () => {
    const choices = [
      ['True', 'Yes'],
      ['False', 'No'],
    ];
    const value = undefined;
    expect(normalizeValue(choices, value)).toStrictEqual(null);
  });
});
