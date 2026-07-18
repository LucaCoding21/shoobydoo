"use client";

import AsciiShimmer from "./AsciiShimmer";

// Bottom-of-page signature for the contact page. Same shimmer/glitch engine as
// the gallery's AsciiCat, just left-aligned with an ASCII (not braille) palette.
const RAW = String.raw`
                                              .-.
                                           +-
                                        .#
                                       #
                                     ++
                                    .-
                                   #+
                          +..--##-++.                .
                         .      .###                 -
                                 -##                 .
                                 -##++ +#           +.
                             .-..####  -            ++
                                  -+-            .  +-
                         .      .-+.+-     -     .##.###
                 ..--+###########+#-#++##+-+##  ..+.+.-..----.
                           -#   #-##-..#-        -#- -##
                               +#      ----#.+-#..#+ #.-
                               .#.    -.   ..++-  .-#+.
                                             .###+#+-#
                                            ##     #-#---##-
                                            ##     ###.#   +
                                             -#-   +- ##   +
                                   -##.           .+. ##-
                                 .#             .#.-##+#.-
                                 -###-.---.      -  ++#
                               .#+#+.      .#+#   .-+                                        .
                              ##.        .#--+#+##-++ #                                      -
                            .#           #+    -#--+  +                                      .
                           .+    -###     -.  .#-#+..-                                       -
                           .     -#-#       .  .+#-  .-                                      +
                          .              +. .##.++   --                                      -
                                         -    ## #-  -#.-+-..+                               #
                           .                   #- +-.##      -#+            -                #
                                               ++#+#-          +#            .               #
                                               .+.##.           #            -              --
                                            #  .-  #            #            +             ###+
                                              #-++ -#          +-           .-            . -#  +
                                         -        .-+-    ....             .#             + .#
                                         +         # #                    --      .       . ##-+-
                                --       #         #  #-                ..                -###-#.
                                 .--      +      ++ +. .##.          .+ -                  - - #.
               .-#+++#+##########.---.---  --.-..#++---.    -+#++#++  ---#++----.          -.+++
                                       --.    ##-.##.  +  +# -#++.--.--+-++-+--.-+-+++. .-.     .+..-##++-------.
                                        +     +.-        --   ----##-                 ..  .+ #+ +  ...
                                              #.          .#    . . +#      .+          -  # ++ #
                                              #.           +#-+             .-          +  ...++-  .
                                               --          ##  .#..+..#+++- -           - -# . -+               .
                                                -#-         .-.-+ ++..#- .# .     ..  ...    -  .. - .++--    .#
                                                              ++-     ##.  ##       #.   #   -+   +          -#
                                                              -#         ..-. -----..#   #   ##           .#+
                                                                .            .-++ +#-+#+.   +#+#-    .-+.
                                                                                .#.-#+.-.-.-.  -++#+
                                                                                 -         .##+-
                                                                            .+-.             +#
                                                                                              #
                                                                                              #
                                                                                              #
                                                                                              #
                                                                                              +
                                                                                              -
`;

// Drop blank leading/trailing lines, then strip the shared left indent so the
// figure sits flush against the left edge of its container.
const lines = RAW.replace(/^\n/, "").replace(/\n$/, "").split("\n");
const inked = lines.filter((l) => l.trim().length > 0);
const indent = inked.length
  ? Math.min(...inked.map((l) => l.length - l.trimStart().length))
  : 0;
const ART = lines.map((l) => l.slice(indent));

const POOL = [".", ":", "-", "+", "*", "#"];

// Size/opacity are overridable so the contact page can render the signature
// smaller on mobile (the full-size figure is wider than a phone viewport).
export default function ContactAscii({
  fontSize = "0.62rem",
  opacity = 0.18,
}: {
  fontSize?: string;
  opacity?: number;
}) {
  return (
    <AsciiShimmer
      art={ART}
      pool={POOL}
      blank=" "
      align="left"
      fontSize={fontSize}
      opacity={opacity}
    />
  );
}
