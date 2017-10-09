<?php
/**
 * Configuration file for yr.no applications
 *
 * Save this file as yr_config.php (without _dist suffix)
 *
 */

$config = array(
    "uri"             => "http://www.yr.no/place/Argentina/C%C3%B3rdoba/Marcos_Ju%C3%A1rez/forecast.xml", // default yr.no forecast URI [forecast.xml / varsel.xml]
    "tmp"             => null,            // cache dir; null => use system temp dir (usually "/tmp")
    "timeout"         => 1800,            // cache time to live (in seconds); 1800 => 30 minutes
    "timezone"        => "America/Argentina/Cordoba",
    "naked"           => true,           // false => include header/footer; true => render as a naked <div> (without header/footer)
    "date_format"     => "d.m.Y",
    "error_reporting" => E_ALL | E_STRICT,
);

$config["config"] = __FILE__;
//    "head"            => dirname(__FILE__)."/../web/yr_head.php",
//    "foot"            => dirname(__FILE__)."/../web/yr_foot.php",
//     "img"        => "",
$config["root"]    = realpath(dirname(__FILE__) ."/../");
$config["library"] = $config["root"] . "/library";

// The following adds the library folder to the PHP include path
ini_set("include_path", $config["library"] . PATH_SEPARATOR . ini_get("include_path"));
error_reporting($config["error_reporting"]);

// Always return an array
return $config;
