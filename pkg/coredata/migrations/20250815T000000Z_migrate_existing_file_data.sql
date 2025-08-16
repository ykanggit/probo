-- Migration to extract file data from existing document content and move it to file_info
-- This handles documents created before the new file structure was implemented

-- First, let's see what we're working with
-- SELECT id, content FROM document_versions WHERE content LIKE '%"fileName"%' LIMIT 5;

-- Update existing document versions that have file data in content
UPDATE document_versions 
SET 
    content = CASE 
        WHEN content::jsonb ? 'content' THEN (content::jsonb->>'content')::text
        ELSE content
    END,
    file_info = CASE 
        WHEN content::jsonb ? 'fileName' THEN 
            json_build_object(
                'fileName', content::jsonb->>'fileName',
                'fileSize', (content::jsonb->>'fileSize')::int,
                'fileType', content::jsonb->>'fileType',
                'fileData', content::jsonb->>'fileData'
            )::text
        ELSE NULL
    END
WHERE 
    content::jsonb ? 'fileName' 
    AND (file_info IS NULL OR file_info = '');
