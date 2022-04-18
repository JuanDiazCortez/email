    CREATE OR REPLACE FUNCTION webinfo.updateemails (email jsonb)
        RETURNS void
        LANGUAGE plpgsql
        AS $function$
        /* variables de v_1 */
    DECLARE
        DECLARE lexists boolean = false;
        DECLARE v_mail alias FOR $1;
        DECLARE v_id  character varying(100)=email->>'messageId';
        DECLARE vcursor CURSOR FOR
            SELECT
                id
            FROM
                webinfo.emails
            WHERE
                 webinfo.emails.mail->>'messageId' = v_id;
    BEGIN
        RAISE info 'buscando %', v_id;
        OPEN vcursor;
        FETCH vcursor INTO lexists;
        CLOSE vcursor;
        RAISE info 'buscando  messageId=% found %  lexists', v_id, FOUND,lexists ;
        IF NOT found THEN
            RAISE info 'NOT FOUND' ;
            RETURN;
        ELSE
        RAISE info 'INSERT' ;    
            BEGIN
                INSERT INTO webinfo.emails (mail)
                    VALUES ($1);
            END;
        END IF;
    END;
    $function$
