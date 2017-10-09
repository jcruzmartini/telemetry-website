<?php
/**
 * yr.php renders a yr.no XML forecast in XHTML
 *
 * The script is designed to run standalone, and does not require any configuration,
 * although you may set the default forecast URI and a few other options.
 *
 * If you edit this file:
 * Remember to save with UTF-8 encoding to avoid trouble if you set an $uri with æøå or other non-ASCII characters
 *
 * @author       Conrad Helgeland
 * @contributor  yr.no (XHTML and CSS)
 * @license
 * @id           $Id$
 * @link         $URL$
 *
 */
error_reporting(0);
// Change the HTTP service URI below to your desired forecast location
$uri = "http://www.yr.no/sted/Norge/Troms/Tromsø/Tromsø/varsel.xml";

/**
 * Configuration (sensible defaults for Norway)
 */
$default = array(
    "uri"             => $uri,              // yr.no http URI for forecast.xml / varsel.xml
    "tmp"             => null,              // cache dir; null => use system temp dir (usually "/tmp")
    "timeout"         => 1800,              // cache time to live (in seconds); 1800 => 30 minutes
    "timezone"        => "America/Argentina/Cordoba",
    "naked"           => true,             // false => include header/footer; true => render as a naked <div> (without header/footer)
    "config"          => dirname(__FILE__)."/config/yr_config.php", // path to optional configuration file
    "head"            => dirname(__FILE__)."/yr_head.php",
    "foot"            => dirname(__FILE__)."/yr_foot.php",
    "img"             => "http://fil.nrk.no/yr/grafikk/sym/b38",
    "date_format"     => "d.m.Y",
    "error_reporting" => E_ALL | E_STRICT,
);

// Load config file (if present)
if (file_exists($default["config"])) {
    $config = array_merge($default, include $default["config"]);
} else {
    $config = $default;
}

/**
 * GET (request) parameters
 */
$uri = (empty($_GET["uri"]) === false) ? $_GET["uri"] :  $config["uri"] ;    // service URI (for varsel.xml)
$q = (empty($_GET["q"]) === false) ? $_GET["q"] : null ;                     // location ("Stadnamn") query



/**
 * PHP runtime settings
 */
error_reporting($config["error_reporting"]);
date_default_timezone_set($config["timezone"]);
libxml_use_internal_errors(true);

/**
 * Start of script
 */

try {
    // Encode and validate URI
    $u = (object) parse_url($uri);
    $np = "";
    foreach (explode("/", $u->path) as $path) {
        if ($path != "") {
            $np .= (ctype_print($path)) ? "/$path" : "/".urlencode($path) ;
        }
    }
    $u->path = $np;
    // Validate
    if ($uri != (strip_tags($uri)) || isset($u->host) === false || strpos($u->host, "yr.no") === false || isset($u->path) === false || strpos($u->path, ".xml") === false) {
        throw new RuntimeException("Forecast URI '".htmlspecialchars($uri)."' is invalid");
    }
    $uri = "$u->scheme://$u->host$u->path";

    // Create temporary file
    $tmpfile = tempnam(md5(uniqid(rand(), true)), '__yr.no__');

    // Find cache directory
    $tmpdir = (file_exists($config["tmp"]) && is_writeable($config["tmp"])) ? $config["tmp"] : dirname($tmpfile);

    // Create cache filename from md5 of $uri
    $cachefile = (file_exists($tmpdir) && is_writeable($tmpdir)) ? $tmpdir . "/yr.no_".md5($uri) : false;

    if (file_exists($cachefile) === false || filemtime($cachefile) < (time() - $config["timeout"])) {

        // Make sure the URI exists and is reachable
        $stream = fopen($uri, "r");
        if ($stream === false) {
            throw new UnexpectedValueException("No network, failed reaching URI '$uri'");
        }
        $stream_metadata = stream_get_meta_data($stream);

        $text_xml = false;
        foreach ($stream_metadata["wrapper_data"] as $header) {
            try{
				if (strpos(strtolower($header), "content-type: text/xml") === 0) {
					$text_xml = true;
				}
			} catch(Exception $e){
			
			}
		}
        /**
         * fopen fails opening unencoded URIs with e.g. æøå
         *
		
		
		
		
		
		
		
         if ($text_xml !== true) {
            throw new UnexpectedValueException("URI '<a href=\"$uri\">$uri</a>' failed returning expected media type 'text/xml'");
        }
*/
        // Create SimpleXML object with remote data at URI $uri
        $sx =  new SimpleXMLElement($uri, LIBXML_NOERROR, true);

        if (file_exists($tmpfile) && is_writeable($tmpfile)) {
            $md5 = md5($sx->saveXML());
            $sx->addAttribute("md5", $md5);
            $sx->addAttribute("cachetime", date(DATE_ATOM));
            $xml = $sx->saveXML();

            file_put_contents($tmpfile, $xml);

            rename($tmpfile, $cachefile);
            if (file_exists($tmpfile)) {
                unlink($tmpfile);
            }
        }
    } else { // read from cache
        $sx =  new SimpleXMLElement($cachefile, LIBXML_NOERROR, true);
    }

    /**
     * Start XML parsing
     */
    date_default_timezone_set( (string) $sx->location->timezone["id"]);

    $location = (string) $sx->location->name;

    // Create link object for accessing links as $link->id
    $links = $sx->xpath("/weatherdata/links/link[@id]");
    $link = new stdClass;
    foreach ($links as $lnk) {
        $linkid = (string) $lnk["id"];
        $link->$linkid = (string) $lnk["url"];
    }

    /**
     * Start output
     **/
    if ($config["naked"] === false) {
        if (file_exists($config["head"])) {
            include $config["head"];
        } else {
            // Header
            header("Content-Type: text/html;");
            echo '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">' .PHP_EOL; ?>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Værvarsel for <?php echo $location; ?> fra yr.no</title>
    <link href="http://www12.nrk.no/yr.no/yr-php.css" rel="stylesheet" type="text/css" />
    <link rel="alternate" type="application/atom+xml" title="Atom feed of <?php echo $location?> weather forecast" href="<?php echo "atom.php?uri=".$uri; ?>" />
  </head>
<body>
<div id="yr-varsel">
    <?php
        } // End header
    } ?>

    <?php
    // Get all text forecasts
    $texts = $sx->xpath("/weatherdata/forecast/text/location/time");

    if ($texts !== false && count($texts) > 0) {
        echo "<!--Text forecast --><h4>Meteorologens varsel for {$sx->forecast->text->location["name"]}</h4>";
        foreach($texts as $text) {
            echo "<p><strong>{$text->title}</strong>: {$text->body}</p>";
        }
    }
    // Tabular forecast
    ?>

<table class="table table-bordered table-striped table-condensed">
<thead>
  <tr>
	<th colspan="2">Fecha / Hora</th><th>Pron&oacute;stico</th><th>Precipitaciones</th><th>Temperatura</th><th>Viento</th><th>Presi&oacute;n</th></tr>
</thead>
<tbody>  


<?php
    $last = "";$i=0; // remember previous date
    foreach ($sx->forecast->tabular->time as $forecast) {
		$i = $i +1;
        // Create human readable dates and times
        $from_unix = strtotime( (string) $forecast["from"]);
        $to_unix   = strtotime( (string) $forecast["to"]);
        $from = date($config["date_format"], $from_unix);
        $to   = date($config["date_format"], $to_unix);
        $from_hour = date("H", $from_unix);
        $to_hour   = date("H", $to_unix);
        $to_hour   = ($to_hour === "00") ? "24" : $to_hour;

        // Conditions text and image (for corresponding symbol)
        $symbol = $forecast->symbol["number"];
        $sky    = $forecast->symbol["name"];
        $file = str_pad($symbol, 2, "0", STR_PAD_LEFT);
        if ((int) $symbol <= 8 && $symbol != 4) {
            $file .= ( ($from_hour >= 00 || $from_hour == 24) && ($from_hour <= 6 && $to_hour <= 6) ) ? "n" : "d";
        }
        $file .= ".png";
		
?>
	<tr>
        <td><?php echo ($from == $last ) ? "" : $from; $last = $from; ?></td>
        <td><?php echo "$from_hour a $to_hour hs"; ?></td>
        <td><img src="<?php echo $config["img"] .'/'. $file .'" alt="'. $forecast->symbol["name"] .'" width="20" height="20" />';?></td>
        <td><?php echo $forecast->precipitation["value"];?> mm </td>
        <td class="<?php echo ($forecast->temperature["value"] <= 0) ? " - " : " + "; ?>"><?php echo $forecast->temperature["value"]; ?> &deg;</td>
        <td class="v"><?php echo " ". $forecast->windSpeed["mps"] ." m/s  ". $forecast->windDirection["code"]; ?></td>
        <td><?php echo (int) $forecast->pressure["value"]; ?> hPa</td>
      </tr>
<?php
  
} // end forecast loop
?>
    </tbody>
  </table>
    </div>
		</div>

<?php
    if ($config["naked"] === false) {
        if (file_exists($config["foot"])) {
            include $config["foot"];
        } else {
            // Footer
?><h4>Om varslene</h4>
  <p>Værsymbolet og nedbørsvarselet gjelder for hele perioden, temperatur- og vindvarselet er for det første tidspunktet.
    &lt;1 mm betyr at det vil komme mellom 0,1 og 0,9 mm nedbør.<br />
  <a href="http://www.yr.no/1.3362862" target="_top">Slik forstår du varslene fra yr.no</a>.</p>
  <p>Vil du også ha <a href="http://www.yr.no/verdata/" target="_top">værvarsel fra yr.no på dine nettsider</a>?</p>
</div>
</body>
</html><?php
    }
    if (strlen($sx["cachetime"]) > 0) {
        echo "<!-- {$sx["cachetime"]} -->";
    }
    } // End footer

/**
 * Error handling
 */
} catch (Exception $e) {

    //echo "<h1>Error</h1>";
    //echo "<p><strong>". get_class($e) ."</strong>: ".$e->getMessage() ."</p>";

    $libxmlerrors = libxml_get_errors();
    //echo "<pre>";
    foreach ($libxmlerrors as $err) {
       // echo $err->message;
    }
    //echo "</pre>";
}
