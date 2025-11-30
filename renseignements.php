<?php

$to = 'joe.taxi94@gmail.com';

if (empty($_POST["checkbox"]))  {

    echo 'Tous les champs sont obligatoires. Cliquez <a href="./index.html">ici</a> pour revenir à la page d\'accueil.';

    exit;

}

$nom = htmlspecialchars($_POST["nom-renseignement"]);

$numero = htmlspecialchars($_POST["numero-renseignement"]);

$message = htmlspecialchars($_POST["message-renseignement"]);

$checkbox = htmlspecialchars($_POST["checkbox"]);


$headers = "MIME-Version: 1.0\r\n";

$headers .= "Content-type: text/plain; charset=UTF-8\r\n";

$headers .= "From: 'joe.taxi@taxiconventionné94.com\r\n";

$headers .= "Reply-To: $mail\r\n";

$message = "Nom: $nom\n";

$message .= "Téléphone: $numero\n";

$message .= "Email: $message\n";


if(mail($to, 'Demande de renseignement JoeTaxi', $message)) {

    echo "<p>Merci <strong>$nom</strong>, votre message a bien été transmis. Nous vous répondrons dans les plus brefs délais.</p>";

    echo '<p><a href="../index.html">Retour à la page d\'accueil</a></p>';

} else {

    echo 'Erreur lors de l\'envoi du mail.';

}

?>