Book-Of-Shaders (AR-Version)


Um das Script selbst zum Laufen zu bringen, wird ein Server inklusive PHP benötigt.
In den PHP-Einstellungen (php.ini) muss der Dateiupload eingestellt werden.


Die Dateien:

- book-of-shaders.php

- ShaderClass.php

- upload.php

- config.php

- default_vertex.vs

- ShaderConfig.php (leer)


müssen in einem Verzeichnis abgelegt werden. Außerdem müssen im gleichen Verzeichnis die Ordner "shaders" und "markers" angelegt werden.

Über den Aufruf der upload.php können nun Shader und Tracking-Marker hochgeladen werden.

Marker können beispielsweise hier generiert werden: https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html

Problemlos getestet wurde in Safari auf iOS und MacOS, sowie Chrome auf iOS. Auf Android und Opera kann es zu Problem mit der Kamera gelangen.