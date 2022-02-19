<?php

if ( isset($_REQUEST['flux']) && !empty($_REQUEST['flux']) )
{
        $url = $_REQUEST['flux'];

        $fileContents= file_get_contents($url);

        $fileContents = str_replace(array("\n", "\r", "\t"), '', $fileContents);

        $fileContents = trim(str_replace('"', "'", $fileContents));

        $simpleXml = simplexml_load_string($fileContents,  'SimpleXMLElement', LIBXML_NOCDATA);

        $json = json_encode($simpleXml);

        echo $json;
}
else
        echo "error";

?>