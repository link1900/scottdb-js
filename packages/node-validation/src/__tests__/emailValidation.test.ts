import { isEmail } from "../emailValidation";

describe("#isEmail", () => {
  const validEmails = [
    "a@a.com",
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@letters-in-local.org",
    "01234567890@numbers-in-local.net",
    "&'*+-./=?^_{}~@other-valid-characters-in-local.net",
    "mixed-1234-in-{+^}-local@sld.net",
    "a@single-character-in-local.org",
    "one-character-third-level@a.example.com",
    "single-character-in-sld@x.org",
    "local@dash-in-sld.com",
    "letters-in-sld@123.com",
    "one-letter-sld@x.org",
    "uncommon-tld@sld.museum",
    "uncommon-tld@sld.travel",
    "uncommon-tld@sld.mobi",
    "country-code-tld@sld.uk",
    "country-code-tld@sld.rw",
    "local@sld.newTLD",
    "the-total-length@of-an-entire-address.cannot-be-longer-than-two-hundred-and-fifty-four-characters.and-this-address-is-250-characters-exactly.so-it-should-be-valid.and-im-going-to-add-some-more-words-here.to-increase-the-lenght-blah-blah-blah-blah.org",
    "the-character-limit@for-each-part.of-the-domain.is-sixty-three-characters.this-is-exactly-sixty-three-characters-so-it-is-valid-blah.com",
    "local@sub.domains.com",
    "backticks`are`legit@test.com",
    "digit-only-domain@123.com",
    "digit-only-domain-with-subdomain@sub.123.com",
  ];

  const invalidEmails = [
    "@@",
    "@missing-local.org",
    "! #$%`|@invalid-characters-in-local.org",
    "(),:;`|@more-invalid-characters-in-local.org",
    "<>@[]\\`|@even-more-invalid-characters-in-local.org",
    ".local-starts-with-dot@sld.com",
    "local-ends-with-dot.@sld.com",
    "two..consecutive-dots@sld.com",
    'partially."quoted"@sld.com',
    "the-local-part-is-invalid-if-it-is-longer-than-sixty-four-characters@sld.net",
    "missing-sld@.com",
    "sld-starts-with-dashsh@-sld.com",
    "sld-ends-with-dash@sld-.com",
    'invalid-characters-in-sld@! "#$%(),/;<>_[]`|.org',
    "missing-tld@sld.",
    "invalid",
    "the-total-length@of-an-entire-address.cannot-be-longer-than-two-hundred-and-fifty-four-characters.and-this-address-is-255-characters-exactly.so-it-should-be-invalid.and-im-going-to-add-some-more-words-here.to-increase-the-lenght-blah-blah-blah-blah-bl.org",
    "the-character-limit@for-each-part.of-the-domain.is-sixty-three-characters.this-is-exactly-sixty-four-characters-so-it-is-invalid-blah-blah.com",
    "missing-at-sign.net",
    "IP-and-port@127.0.0.1:25",
    "trailing-dots@test.de.",
    "dot-on-dot-in-domainname@te..st.de",
    "dot-first-in-domain@.test.de",
    "a@a.com; b@a.com",
    "",
    null,
    undefined,
    [],
    { email: "a@a.com" },
  ];

  validEmails.forEach((email) => {
    it(`email of '${email}' is valid`, () => {
      expect(isEmail(email)).toEqual(true);
    });
  });

  invalidEmails.forEach((email) => {
    it(`email of '${email}' is invalid`, () => {
      expect(isEmail(email)).toEqual(false);
    });
  });
});
