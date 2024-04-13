# Zadanie 1

<pre>
Zadanie:
Przy pomocy <a href="https://www.bioinformatics.org/sms2/random_dna.html">strony</a> wygeneruj nić DNA o długości minimum 2 tysięcy znaków (podzielną przez trzy).
Napisz skrypt, który w wprowadzonej przez użytkownika sekwencji:

    	<span class="c1">- zamieni wszystkie znaki na duże,
    	- podzieli wizualnie dna na tryplety
    	- wytłuści i zaznaczy kolorem zielonym (użyj wrapperów) kodony "ATG"
    	- doda żółte tło kodonom "TAA", "TAG" i "TGA"
    	- dopisze nić komplementarną</span>
    	<span class="c2">- poda statystykę występowania poszczególnych kodonów, posortuje ją malejąco,
    	- pokoloruje każdą kolejną piątkę dowolnym losowym kolorem (Math.random())</span>

    przykładowo dla wejścia (prompt):
    tgaactatgataataagtttaggatacgcaaaatgttaaagctatgttccctagtga

    wypisze:
    tgaactatgataataagtttaggatacgcaaaatgttaaagctatgttccctagtga
    <span class="taa">TGA</span> ACT <span class="atg">ATG</span> ATA ATA AGT TTA GGA TAC GCA AAA TGT <span class="taa">TAA</span> AGC TAT GTT CCC <span class="taa">TAG</span> <span class="taa">TGA</span><br>
    ACT TGA TAC TAT TAT TCA AAT CCT ATG CGT TTT ACA ATT TCG ATA CAA GGG ATC ACT
    acttgatactattattcaaatcctatgcgttttacaatttcgatacaagggatcact

    <span style="background-color:#ab25c9;">ATA - 2</span>
    <span style="background-color:#ab25c9;">TGA - 2</span>
    <span style="background-color:#ab25c9;">ACT - 1</span>
    <span style="background-color:#ab25c9;">ATG - 1</span>
    <span style="background-color:#ab25c9;">AGT - 1</span>
    <span style="background-color:#c2c6f0;">TTA - 1</span>
    <span style="background-color:#c2c6f0;">GGA - 1</span>
    <span style="background-color:#c2c6f0;">TAC - 1</span>
    <span style="background-color:#c2c6f0;">GCA - 1</span>
    <span style="background-color:#c2c6f0;">AAA - 1</span>
    <span style="background-color:#f0cb51;">TGT - 1</span>
    <span style="background-color:#f0cb51;">TAA - 1</span>
    <span style="background-color:#f0cb51;">AGC - 1</span>
    <span style="background-color:#f0cb51;">TAT - 1</span>
    <span style="background-color:#f0cb51;">GTT - 1</span>
    <span style="background-color:#b4ffb7;">TAG - 1</span>
    <span style="background-color:#b4ffb7;">CCC - 1</span>

Pomoce:
Zasady azotowe:
T - Tymina
C - Cytozyna
G - Guanina
A - Adenina

    Nić komplementarna:
    	A &lt;-&gt; T
    	C &lt;-&gt; G
</pre>

<br /><br /><br />

# Zadanie 2

<pre>
1. Na stronie wypisz:
        - wytłuszczony napis "Witaj JavaScript"
        - jedna pod drugą liczby z zakresu: &lt;-111;111&gt;
        - malejąco co trzecią liczbę (oddzielone spacjami) z zakresu: (0;50&gt;
                =&gt;"50 47 44 41 3835 32 29 26 23 20 17 14 11 8 5 2"
        - malejąco liczby z zakresu: &lt;10;50&gt; \ (20;40)
	
2. W konsoli wypisz:
        - liczby parzyste z przedziału: &lt;-30;40) \ (5;14)
        - liczby nieparzyste z przedziału: &lt;-20;40&rpar;\ &lpar;3;12&rpar;
        - tylko liczby podzielne przez 3 z przedziału: &lt;-100;41&rpar; \ (-50;12)
	
3. Używając okna dialogowego pobierz wartość od użytkownika i wypisz na stronie (np. dla liczby 6):
		
  a&rpar; XXXXXX
		
  b&rpar; X X X X X X
     X         X
     X         X
     X         X
     X         X
     X X X X X X

  c&rpar; (nie używaj znacznika CENTER itp.)

     XXXXXX
     X   X
     X  X
     X X
     XX
     X

  d&rpar;
     1
     12
     123
     1234
     12345
     123456
				
  e&rpar;
          1
         21
        321
       4321
      54321
     654321
				
  f&rpar; silnię podanej liczby
  g&rpar; sumę liczb nieparzystych w zakresie 0 do podanej lczby
  h&rpar; w oknie dialogowym informację czy podana liczba jest pierwsza
  i&rpar; w tabelece html'owej tabliczkę mnożenia wraz z nagłówkami, zachowaj kolorystykę (przekątna nagłówki, "połówki") i pozbądź się 0 w lewym górnym rogu

4. pobierz od użytkownika PESEL - <a href="https://pl.wikipedia.org/wiki/PESEL" target="_blank">wiki</a>
    - sprawdź jego poprawność (jeśli zły stosowna informacja)
    - wypisz pochodzące z niego informację tj:
  	    a&rpar; płeć (M/K)
  	    b&rpar; datę urodzenia (weź pod uwagę różne stulecia)
</pre>

<br /><br /><br />

# Zadanie 3

<pre>
1. Guma (img)

2. Lecący tekst (input type text)

3. Spadające tablice znaków (w textarea)
- przestrzeń losowania: cols x rows
- możliwy znak do wylosowania: a-z, A-Z
- szansa na wylosowanie znaku na danej pozycji: 5%
- po spadnięciu jednego zestawu znaków losuje się kolejna tablica
	
4. "Pasąca" się grafika (ruch po "koniczynie" z użyciem top/left, proszę nie używaj CSS'owej animacji)
</pre>
