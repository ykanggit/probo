-- Clean up orphaned tasks that reference non-existent measures
DELETE FROM tasks 
WHERE measure_id IS NOT NULL 
AND measure_id NOT IN (SELECT id FROM measures); 