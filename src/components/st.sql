CREATE OR REPLACE FUNCTION webinfo.updateemails(email jsonb)
 RETURNS boolen
 LANGUAGE plpgsql
AS $function$
        /* variables de v_1 */
    
        DECLARE lexists integer = 0 ;
        DECLARE v_mail alias FOR $1;
        DECLARE v_id  text = email->>'messageId';
        DECLARE vcursor CURSOR FOR
            SELECT
                count(*)
            FROM
                webinfo.emails
            WHERE
                 webinfo.emails.mail->>'messageId' = v_id;
    BEGIN
        RAISE info 'buscando %', v_id;
        OPEN vcursor;
        FETCH vcursor INTO lexists;
        CLOSE vcursor;
        RAISE info 'buscando  messageId=% found=%  lexists=%', v_id, FOUND,lexists ;
        IF lexists != 0  THEN
            RAISE info 'FOUND estaba' ;
            RETURN false;
        ELSE
        RAISE info 'INSERT' ;    
            BEGIN
                INSERT INTO webinfo.emails (mail)
                    VALUES ($1);
            END;
            return true;
        END IF;
    END;
    $function$
