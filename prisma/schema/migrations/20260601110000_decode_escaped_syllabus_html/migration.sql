UPDATE "syllabuses"
SET "content" = REPLACE(
  REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE("content", '&#x2F;', '/'),
          '&#x27;', ''''
        ),
        '&quot;', '"'
      ),
      '&gt;', '>'
    ),
    '&lt;', '<'
  ),
  '&amp;', '&'
)
WHERE "content_type" = 'html'
  AND (
    "content" LIKE '%&lt;%'
    OR "content" LIKE '%&gt;%'
    OR "content" LIKE '%&quot;%'
    OR "content" LIKE '%&#x27;%'
    OR "content" LIKE '%&#x2F;%'
    OR "content" LIKE '%&amp;%'
  );
