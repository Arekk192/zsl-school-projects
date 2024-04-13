<?php 
include("passwd.php");

#region requests
$cookie_file_path = ""; // path for storing cookies 
$ch = curl_init();
curl_setopt($ch, CURLOPT_COOKIEFILE, $cookie_file_path); // "The name of the file containing the cookie data ..."
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); // "Set CURLOPT_RETURNTRANSFER to TRUE to return the transfer as a string of the return value of curl_exec()"
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1); // "true to follow any "Location: " header that the server sends as part of the HTTP header."

function get(string $url) {
    global $ch;
    curl_setopt($ch, CURLOPT_URL, $url); // "The URL to fetch."
    return curl_exec($ch);
}

function post(string $url, array $fields) {
    global $ch;
    $POSTFIELDS = http_build_query($fields);
    curl_setopt($ch, CURLOPT_POST, 1); // "true to do a regular HTTP POST."
    curl_setopt($ch, CURLOPT_POSTFIELDS, $POSTFIELDS); // "The full data to post in a HTTP "POST" operation."
    curl_setopt($ch, CURLOPT_URL, $url);
    return curl_exec($ch);
}

get("https://synergia.librus.pl/loguj/portalRodzina?v=1706698887");
$res = post("https://api.librus.pl/OAuth/Authorization?client_id=46", array(
    "action" => "login", "login" => $login, "pass" => $password
));
$goTo = "https://api.librus.pl" . json_decode($res) -> {'goTo'};
$res = post($goTo, array(
    "command" => "open_synergia_window",
    "commandPayload" => array(
        "url" => "https:\/\/synergia.librus.pl\/uczen\/index"
    )
));
#endregion

$html_code = get("https://synergia.librus.pl/przegladaj_oceny/uczen");

echo '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>';

if (preg_match('/<div\s><center><\/center><\/div>.*?<div\sid="footer">/s', $html_code, $matches)) {
    $output = $matches[0];
    $output = preg_replace('/<div class=\'right screen-only\'>.*?<\/div>/s', "", $output);
    $output = preg_replace('/<div class=(\'|\")legend left stretch(\'|\")>.*?\<\/div\>.*?\<\/div\>/s', "", $output);
    
    // $output = preg_replace('/src=\"\/images/s', "src=\"https://synergia.librus.pl/images", $output);    
    $output = preg_replace('/src=\"\/js/s', "src=\"https://synergia.librus.pl/js", $output);    

    echo "<style>"; include './style.css'; echo "</style>";
    echo "<div class=\"container-background\">$output<div/>";
} 

$dom = new DOMDocument(); 
@$dom -> loadHTML($output);
$xpath = new DOMXPath($dom);
$trs_grades = $xpath -> query('//table[@class="decorated stretch"][1]/tr[position() mod 2 = 1]'); 
$trs_points = $xpath -> query('//table[@class="decorated stretch"][2]/tbody/tr[position() mod 2 = 1]');

function get_grades(DOMElement $grades_DOMElement) {
    $grades = array();

    foreach ($grades_DOMElement -> getElementsByTagName('a') as $a) {
        preg_match('/\d<br>/', $a -> getAttribute("title"), $matches);
        $grade = $a -> nodeValue; $weight = intval($matches[0]);
        if ($weight) array_push($grades, [$grade, $weight]);
    }

    return array_map(function($grade) { 
        if ($grade[0] == "3+") return [3.5, $grade[1]];
        elseif ($grade[0] == "4+") return [4.5, $grade[1]];
        else return $grade;
    }, $grades);
}

function calculate_average_normal($grades) {
    $count = $total = 0;
    foreach ($grades as $grade) { $total += $grade[0] * $grade[1]; $count += $grade[1]; }
    return round(($total / $count) * 100) / 100;
}

function get_html_from_DOMElement(DOMNode $element) { 
    $innerHTML = ""; 
    foreach ($element -> childNodes as $child) { 
        $innerHTML .= $element -> ownerDocument -> saveHTML($child);
    }
    return $innerHTML; 
}

$grades_subjects = [];
foreach ($trs_grades as $tr) {
    $string = $tr -> getElementsByTagName('td') -> item(2) -> nodeValue;
    $subject = $tr -> getElementsByTagName('td') -> item(1) -> nodeValue;

    if (!str_contains($string, "Brak ocen") && !str_contains($subject, "Zachowanie")) {
        $grades_DOMElement = $tr -> getElementsByTagName('td') -> item(2);
        $grades_i = get_grades($grades_DOMElement);

        $grades_DOMElement = $tr -> getElementsByTagName('td') -> item(6);
        $grades_ii = get_grades($grades_DOMElement);

        array_push($grades_subjects, array(
            "subject" => $subject,
            "average_I" => calculate_average_normal($grades_i),
            "average_II" => calculate_average_normal($grades_ii),
            "average" => calculate_average_normal(array_merge($grades_i, $grades_ii))
        ));
    }
}
echo "<pre>"; print_r($grades_subjects); echo "</pre>";

$points_subjects = [];
foreach ($trs_points as $tr) {
    $tds = $tr -> getElementsByTagName('td');
    $subject = $tds -> item(1) -> nodeValue;
    $grades_i = $tds -> item(2) -> nodeValue;
    $grades_ii = $tds -> item(5) -> nodeValue;
    $sum_i = $count_i = $sum_ii = $count_ii = 0;

    if (!str_contains($grades_i, "Brak ocen") && !str_contains($grades_ii, "Brak ocen") && $subject != "Zachowanie") {
        foreach(explode("\n", $grades_i) as $grade) {
            if ($grade !== "") {
                $data = explode("/", $grade);
                $sum_i += $data[0]; $count_i += $data[1];
            }}
        foreach(explode("\n", $grades_ii) as $grade) {
            if ($grade !== "") {
                $data = explode("/", $grade);
                $sum_ii += $data[0]; $count_ii += $data[1];
            }}

        array_push($points_subjects, array(
            "subject" => $subject,
            "average_I" => round(($sum_i / $count_i) * 10000) / 100,
            "average_II" => round(($sum_ii / $count_ii) * 10000) / 100,
            "average" => round((($sum_i + $sum_ii) / ($count_i + $count_ii)) * 10000) / 100
        ));
    }
}
echo "<pre>"; print_r($points_subjects); echo "</pre>";
?>

