const { useState, useEffect } = React;

const MENU = window.MENU_DATA;

const HERO_IMAGE = 'p1';
const ABOUT_IMAGE = 'p2';
const PHONE_E164 = '+38520642111';
const INSTAGRAM_URL = 'https://www.instagram.com/subcaffegourmet/';
const FACEBOOK_URL = 'https://www.facebook.com/subcaffegourmet';
const SOCIAL_HANDLE = '@subcaffegourmet';
const EMAIL = 'info@subgourmet.hr';
const CAREERS_URL = 'careers.html';

// Google Maps listing, checked 2026-08-31. Note the other platforms differ a
// lot (Facebook 4.5/16, TripAdvisor ~3.2/29), so the source is stated in the
// copy rather than left ambiguous.
const GOOGLE_RATING = '4.5';
const GOOGLE_REVIEWS = 285;
const PHONE_DISPLAY = '+385 20 642 111';

// Brand mark, traced from the 2026 logo artwork. Inlined so it inherits the
// nav's currentColor as the header transitions, and costs no extra request.
const LOGO_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"250 824 2578 834\" role=\"img\" aria-label=\"Sub Gourmet\"><defs><path id=\"font_2_54\" d=\"M.237 .241C.20766 .251 .18099 .26116 .157 .2715 .133 .28183 .11234 .29433 .095 .30899 .07767 .32366 .06416 .34116 .05449 .3615 .04483 .38183 .03999 .40667 .03999 .436 .03999 .49267 .06183 .53799 .1055 .57199 .14917 .606 .21034 .623 .289 .623 .31767 .623 .34433 .621 .369 .61699 .39367 .61299 .41484 .60683 .4325 .5985 .45016 .59016 .464 .5795 .474 .5665 .484 .5535 .489 .53833 .489 .521 .489 .50366 .485 .48883 .47699 .47649 .46899 .46416 .45933 .45366 .448 .44501 .43333 .45434 .41366 .4625 .38899 .4695 .36433 .4765 .33734 .48 .308 .48 .278 .48 .256 .47583 .24199 .4675 .22799 .45917 .22099 .44867 .22099 .436 .22099 .42601 .22533 .41784 .23399 .4115 .24266 .40516 .25566 .39933 .27299 .394L.326 .377C.38867 .357 .43683 .3315 .47049 .30049 .50416 .2695 .521 .22733 .521 .174 .521 .11733 .49866 .0715 .45399 .0365 .40933 .0015 .34366-.01601 .257-.01601 .22633-.01601 .19783-.0135 .17149-.0085 .14517-.0035 .12217 .00382 .10249 .01349 .08283 .02316 .06749 .03517 .05649 .0495 .04549 .06383 .03999 .08033 .03999 .099 .03999 .11834 .04566 .13484 .05699 .1485 .06833 .16217 .08067 .17267 .09399 .17999 .11266 .16533 .13549 .15267 .16249 .142 .1895 .13134 .219 .12601 .25101 .12601 .28367 .12601 .30667 .13101 .31999 .14101 .33333 .15101 .34 .16267 .34 .17599 .34 .18933 .33466 .1995 .32399 .2065 .31333 .2135 .29833 .22033 .27901 .22701L.237 .241Z\"/><path id=\"font_2_56\" d=\"M.60201 .224C.60201 .188 .59584 .15516 .5835 .12549 .57117 .09583 .55333 .0705 .53 .0495 .50666 .0285 .47833 .01233 .44499 .00099 .41167-.01034 .374-.01601 .332-.01601 .29-.01601 .25233-.01034 .21899 .00099 .18567 .01233 .15734 .0285 .134 .0495 .11067 .0705 .09283 .09583 .08049 .12549 .06816 .15516 .062 .188 .062 .224V.606C.06933 .60734 .081 .60917 .097 .6115 .113 .61384 .12834 .61501 .14301 .61501 .15834 .61501 .17183 .61384 .1835 .6115 .19517 .60917 .205 .605 .213 .599 .221 .593 .22701 .58466 .231 .57399 .235 .56333 .237 .54933 .237 .532V.22701C.237 .195 .24583 .17 .26349 .15199 .28116 .134 .304 .125 .332 .125 .36067 .125 .38367 .134 .401 .15199 .41833 .17 .427 .195 .427 .22701V.606C.43434 .60734 .446 .60917 .46199 .6115 .47799 .61384 .49333 .61501 .508 .61501 .52334 .61501 .53683 .61384 .54849 .6115 .56016 .60917 .56999 .605 .57799 .599 .58599 .593 .592 .58466 .59599 .57399 .6 .56333 .60201 .54933 .60201 .532V.224Z\"/><path id=\"font_2_37\" d=\"M.235 .125C.24433 .12233 .25633 .1205 .271 .11949 .28566 .11849 .29967 .118 .313 .118 .33967 .118 .36183 .12349 .3795 .13449 .39717 .1455 .40601 .16267 .40601 .186 .40601 .208 .39867 .22366 .384 .23299 .36933 .24232 .347 .24699 .317 .24699H.235V.125M.235 .369H.308C.33666 .369 .3575 .37433 .3705 .38499 .3835 .39567 .39 .41134 .39 .43201 .39 .45 .3825 .46433 .36749 .47499 .3525 .48566 .33 .491 .3 .491 .29 .491 .2785 .49066 .2655 .48999 .2525 .48933 .24233 .48833 .235 .487V.369M.3-.01601C.28867-.01601 .27533-.01567 .25999-.015 .24466-.01434 .22883-.01301 .21249-.011 .19617-.009 .18-.0065 .164-.00349 .148-.00049 .13333 .00367 .12 .009 .08333 .023 .065 .04733 .065 .082V.549C.065 .563 .06883 .57384 .07649 .5815 .08416 .58917 .09467 .59534 .108 .60001 .13067 .608 .159 .61383 .19299 .61749 .227 .62116 .262 .623 .298 .623 .38333 .623 .44899 .60867 .495 .58 .541 .55134 .564 .507 .564 .44701 .564 .417 .55533 .39116 .53799 .36949 .52066 .34783 .49733 .33201 .468 .32201 .50134 .31267 .52917 .29566 .5515 .271 .57384 .24633 .58501 .21533 .58501 .17799 .58501 .11199 .56051 .06316 .51151 .03149 .4625-.00017 .392-.01601 .3-.01601Z\"/><path id=\"font_2_42\" d=\"M.614 .099C.614 .07833 .61033 .06299 .603 .05299 .59566 .04299 .58399 .03333 .56799 .024 .55866 .01867 .547 .0135 .53299 .0085 .51899 .0035 .50366-.00082 .487-.00449 .47034-.00816 .45284-.011 .43449-.013 .41616-.015 .398-.01601 .38-.01601 .332-.01601 .287-.00951 .245 .00349 .203 .01649 .1665 .03616 .1355 .0625 .1045 .08884 .08 .12167 .062 .161 .044 .20033 .035 .246 .035 .298 .035 .35267 .04484 .40033 .0645 .44099 .08416 .48166 .11016 .5155 .14249 .5425 .17483 .56949 .21183 .58966 .25349 .603 .29516 .61633 .338 .623 .382 .623 .44534 .623 .4955 .61283 .5325 .5925 .5695 .57216 .588 .54566 .588 .513 .588 .49567 .58366 .48067 .575 .468 .56633 .45534 .55633 .44534 .545 .438 .52834 .448 .5075 .45783 .4825 .4675 .4575 .47716 .42934 .48199 .39799 .48199 .342 .48199 .2975 .46599 .2645 .43399 .2315 .402 .215 .35767 .215 .30099 .215 .27033 .2195 .24384 .2285 .2215 .2375 .19917 .24967 .18084 .265 .1665 .28033 .15217 .29799 .1415 .31799 .13449 .338 .12749 .35934 .12399 .382 .12399 .39667 .12399 .40967 .12533 .42101 .12799 .43234 .13067 .441 .13367 .44701 .13699V.231H.34C.336 .23834 .33216 .248 .32849 .25999 .32483 .272 .323 .28467 .323 .298 .323 .322 .3285 .33933 .33949 .34999 .3505 .36066 .36467 .366 .382 .366H.55099C.57099 .366 .58649 .36049 .59749 .34949 .6085 .33849 .614 .32299 .614 .30299V.099Z\"/><path id=\"font_2_50\" d=\"M.035 .304C.035 .356 .04317 .402 .05949 .442 .07583 .482 .09816 .5155 .1265 .5425 .15484 .56949 .18817 .58999 .2265 .60399 .26483 .618 .30633 .625 .351 .625 .39567 .625 .43716 .618 .47549 .60399 .51383 .58999 .54734 .56949 .576 .5425 .60467 .5155 .62717 .482 .64349 .442 .65983 .402 .668 .356 .668 .304 .668 .252 .66 .20583 .644 .1655 .628 .12516 .60583 .0915 .5775 .0645 .54917 .0375 .51567 .017 .47701 .00299 .43834-.01101 .39634-.01801 .351-.01801 .30567-.01801 .26367-.01084 .22501 .00349 .18634 .01783 .153 .03866 .125 .06599 .097 .09333 .07499 .12699 .05899 .16699 .043 .207 .035 .25267 .035 .304M.215 .304C.215 .24333 .22733 .198 .252 .168 .27667 .138 .30967 .123 .351 .123 .393 .123 .42634 .138 .451 .168 .47567 .198 .48801 .24333 .48801 .304 .48801 .364 .47584 .409 .45149 .439 .42716 .46899 .394 .48399 .35201 .48399 .31066 .48399 .27749 .46916 .25249 .4395 .22749 .40984 .215 .36467 .215 .304Z\"/><path id=\"font_2_53\" d=\"M.239 .196V.004C.23166 .002 .22016 .00001 .2045-.002 .18883-.004 .17333-.005 .158-.005 .14266-.005 .12916-.00384 .11749-.0015 .10583 .00083 .09617 .005 .0885 .011 .08083 .017 .075 .02533 .071 .036 .067 .04667 .065 .06067 .065 .078V.549C.065 .563 .06883 .57384 .07649 .5815 .08416 .58917 .09467 .59534 .108 .60001 .13067 .608 .157 .61383 .187 .61749 .217 .62116 .249 .623 .283 .623 .37501 .623 .44434 .60367 .491 .565 .53767 .52634 .561 .474 .561 .408 .561 .36666 .55033 .33132 .52899 .30199 .50766 .27266 .48233 .24999 .453 .23399 .477 .20133 .50067 .17066 .524 .142 .54734 .11333 .56567 .08733 .57899 .064 .57233 .04067 .56017 .02284 .5425 .0105 .52484-.00183 .505-.008 .483-.008 .46833-.008 .45566-.00633 .44499-.00299 .43433 .00034 .425 .005 .41699 .011 .409 .017 .40166 .02434 .39499 .033 .38833 .04167 .382 .05101 .37601 .061L.29201 .196H.239M.302 .32899C.32733 .32899 .34733 .33549 .362 .3485 .37667 .3615 .384 .38067 .384 .40601 .384 .43134 .37583 .4505 .3595 .4635 .34317 .4765 .31734 .483 .282 .483 .272 .483 .264 .48267 .258 .48199 .25199 .48133 .24533 .48034 .23801 .479V.32899H.302Z\"/><path id=\"font_2_48\" d=\"M.48399 .149C.47533 .14167 .46416 .13583 .45049 .1315 .43682 .12717 .421 .125 .403 .125 .379 .125 .35917 .128 .34351 .134 .32784 .14 .31767 .15033 .313 .16499 .29434 .22367 .279 .27117 .267 .3075 .25499 .34383 .24566 .37567 .239 .403H.23399C.232 .36366 .2305 .32782 .22949 .29549 .2285 .26316 .22783 .23166 .22749 .20099 .22717 .17033 .2265 .13933 .22549 .108 .2245 .07667 .223 .042 .22099 .004 .21233 .00066 .20099-.00217 .187-.0045 .173-.00683 .159-.008 .145-.008 .11567-.008 .09283-.00333 .07649 .006 .06017 .01534 .052 .03234 .052 .05701L.08099 .567C.08633 .57567 .098 .585 .116 .595 .134 .605 .15934 .61 .192 .61 .22733 .61 .25499 .6045 .27499 .59349 .29499 .58249 .30966 .56466 .319 .53999 .325 .524 .3315 .50567 .3385 .485 .3455 .46433 .3525 .44299 .3595 .42099 .3665 .399 .37333 .37717 .37999 .3555 .38666 .33383 .39266 .31433 .39799 .297H.403C.419 .353 .435 .40716 .451 .45949 .46701 .51183 .48167 .55566 .495 .591 .50499 .59633 .51783 .60083 .53349 .60449 .54917 .60816 .56667 .61 .586 .61 .61866 .61 .64533 .60516 .666 .59549 .68667 .58583 .69867 .572 .702 .554 .70466 .54066 .70749 .52016 .71049 .49249 .7135 .46483 .71666 .43367 .72 .399 .72334 .36433 .72667 .32767 .73 .289 .73333 .25034 .7365 .21317 .7395 .17749 .7425 .14183 .745 .10916 .74699 .0795 .749 .04984 .75034 .027 .75101 .011 .73966 .00434 .72783-.00049 .7155-.00349 .70317-.0065 .68734-.008 .668-.008 .64267-.008 .62134-.00366 .604 .005 .58667 .01367 .57734 .03067 .576 .056 .57201 .12866 .5695 .194 .5685 .252 .5675 .31 .566 .35867 .564 .39799H.55901C.55233 .37199 .54266 .33932 .53 .29999 .51733 .26066 .502 .21033 .48399 .149Z\"/><path id=\"font_2_40\" d=\"M.065 .513C.065 .54167 .07333 .56433 .09 .58099 .10667 .59767 .12934 .606 .158 .606H.48801C.49267 .59867 .49683 .589 .50049 .577 .50416 .565 .506 .55234 .506 .539 .506 .51367 .5005 .49567 .4895 .485 .47851 .47433 .464 .46899 .446 .46899H.235V.37601H.46001C.46467 .36867 .46883 .35917 .47249 .3475 .47616 .33584 .478 .32333 .478 .31 .478 .28467 .47266 .26667 .46199 .256 .45133 .24534 .437 .24001 .41901 .24001H.235V.13499H.492C.49666 .12766 .50082 .11799 .50449 .10599 .50816 .09399 .50999 .08133 .50999 .06799 .50999 .04266 .5045 .0245 .4935 .01349 .4825 .00249 .468-.00301 .45-.00301H.158C.12934-.00301 .10667 .00533 .09 .02199 .07333 .03866 .065 .06133 .065 .09V.513Z\"/><path id=\"font_2_55\" d=\"M.037 .466C.03233 .47334 .028 .48334 .024 .496 .02 .50867 .01801 .522 .01801 .536 .01801 .562 .02383 .58066 .03549 .592 .04716 .60333 .06233 .60899 .08099 .60899H.517C.52167 .60167 .526 .59167 .53 .57899 .534 .56633 .536 .553 .536 .539 .536 .513 .53016 .49433 .51849 .483 .50684 .47167 .49167 .466 .47301 .466H.362V.004C.35467 .002 .34317 .00001 .3275-.002 .31183-.004 .29634-.005 .28101-.005 .26567-.005 .25216-.00384 .24049-.0015 .22884 .00083 .219 .005 .211 .011 .203 .017 .197 .02533 .19299 .036 .189 .04667 .187 .06067 .187 .078V.466H.037Z\"/></defs><g><use xlink:href=\"#font_2_54\" transform=\"matrix(890.13,0,0,-890.13,-1650.19,-303.74)\" fill=\"currentColor\"/><use xlink:href=\"#font_2_56\" transform=\"matrix(890.13,0,0,-890.13,-1159.73,-303.74)\" fill=\"currentColor\"/><use xlink:href=\"#font_2_37\" transform=\"matrix(890.13,0,0,-890.13,-568.69,-303.74)\" fill=\"currentColor\"/><path transform=\"matrix(1,0,0,-1,2375,1470.5)\" d=\"M0 0C12.07-3.458 27.6-5.824 46.59-7.119 65.56-8.413 83.68-9.06 100.95-9.06 135.45-9.06 164.15-1.942 187.02 12.29 209.87 26.53 221.31 48.73 221.31 78.95 221.31 107.42 211.81 127.68 192.84 139.78 173.85 151.85 144.95 157.9 106.13 157.9H0ZM0 315.79H94.48C131.57 315.79 158.54 322.69 175.37 336.5 192.19 350.29 200.6 370.57 200.6 397.33 200.6 420.62 190.9 439.17 171.49 452.98 152.07 466.77 122.95 473.69 84.12 473.69 71.18 473.69 56.3 473.24 39.48 472.39 22.65 471.52 9.485 470.23 0 468.51ZM84.12-182.49C69.44-182.49 52.19-182.04 32.35-181.19 12.5-180.32-7.987-178.6-29.12-176.01-50.27-173.43-71.18-170.19-91.89-166.31-112.6-162.43-131.59-157.05-148.84-150.13-196.3-132.01-220.02-100.53-220.02-55.65V548.75C-220.02 566.87-215.06 580.88-205.13 590.82-195.22 600.72-181.64 608.71-164.37 614.76-135.04 625.11-98.36 632.65-54.36 637.41-10.35 642.14 34.94 644.52 81.54 644.52 191.97 644.52 276.96 625.96 336.5 588.87 396.03 551.76 425.8 494.39 425.8 416.74 425.8 377.91 414.58 344.47 392.15 316.44 369.7 288.39 339.51 267.9 301.56 254.96 344.69 242.87 380.71 220.87 409.62 188.96 438.52 157.03 452.98 116.91 452.98 68.59 452.98-16.82 421.27-80.04 357.85-121.01 294.44-161.98 203.19-182.49 84.12-182.49\" fill=\"currentColor\"/><path transform=\"matrix(1,0,0,-1,506.42,1323.52)\" d=\"M0 0C-37.98 12.94-72.48 26.09-103.54 39.47-134.6 52.84-161.35 69.02-183.78 88.01-206.23 106.98-223.7 129.62-236.2 155.95-248.71 182.26-254.96 214.4-254.96 252.37-254.96 325.7-226.71 384.38-170.19 428.39-113.69 472.39-34.52 494.39 67.3 494.39 104.39 494.39 138.91 491.81 170.84 486.63 202.75 481.45 230.15 473.46 253.02 462.69 275.87 451.89 293.79 438.1 306.73 421.27 319.67 404.45 326.14 384.81 326.14 362.38 326.14 339.94 320.97 320.75 310.62 304.79 300.26 288.81 287.74 275.23 273.08 264.02 254.09 276.1 228.63 286.67 196.72 295.73 164.79 304.79 129.85 309.32 91.89 309.32 53.06 309.32 24.59 303.92 6.471 293.14-11.65 282.34-20.71 268.75-20.71 252.37-20.71 239.43-15.11 228.86-3.883 220.67 7.321 212.46 24.14 204.91 46.59 198.02L115.19 176.01C196.28 150.13 258.62 117.13 302.2 77.01 345.76 36.88 367.56-17.69 367.56-86.71 367.56-160.06 338.64-219.37 280.85-264.67 223.03-309.97 138.04-332.62 25.89-332.62-13.81-332.62-50.7-329.38-84.77-322.91-118.87-316.44-148.63-306.95-174.07-294.44-199.53-281.94-219.37-266.41-233.61-247.84-247.84-229.3-254.96-207.95-254.96-183.78-254.96-158.76-247.64-137.41-232.96-119.72-218.3-102.04-202.34-88.45-185.07-78.95-160.93-97.94-131.36-114.34-96.42-128.13-61.48-141.94-23.3-148.84 18.12-148.84 60.38-148.84 90.15-142.37 107.42-129.42 124.67-116.48 133.31-101.39 133.31-84.12 133.31-66.88 126.39-53.71 112.6-44.65 98.79-35.59 79.37-26.75 54.36-18.12Z\" fill=\"currentColor\"/></g><use xlink:href=\"#font_2_42\" transform=\"matrix(152.67,0,0,-152.67,871.36,1645.21)\" fill=\"currentColor\"/><use xlink:href=\"#font_2_50\" transform=\"matrix(152.67,0,0,-152.67,1064.33,1645.21)\" fill=\"currentColor\"/><use xlink:href=\"#font_2_56\" transform=\"matrix(152.67,0,0,-152.67,1263.25,1645.21)\" fill=\"currentColor\"/><use xlink:href=\"#font_2_53\" transform=\"matrix(152.67,0,0,-152.67,1456.23,1645.21)\" fill=\"currentColor\"/><use xlink:href=\"#font_2_48\" transform=\"matrix(152.67,0,0,-152.67,1640.19,1645.21)\" fill=\"currentColor\"/><use xlink:href=\"#font_2_40\" transform=\"matrix(152.67,0,0,-152.67,1853.47,1645.21)\" fill=\"currentColor\"/><use xlink:href=\"#font_2_55\" transform=\"matrix(152.67,0,0,-152.67,2028.73,1645.21)\" fill=\"currentColor\"/><g><path transform=\"matrix(1,0,0,-1,2057.11,1065.78)\" d=\"M0 0C0 22.43-2.59 40.55-7.767 54.36-12.94 68.15-20.71 78.95-31.06 86.71-41.42 94.48-54.16 99.86-69.24 102.89-84.35 105.9-101.82 107.42-121.66 107.42-140.65 107.42-160.49 105.9-181.19 102.89-201.9 99.86-217.01 97.49-226.49 95.77L-223.49-100.51C-223.49-141.92-234.72-174.28-257.14-197.58-279.59-220.87-309.36-232.52-346.44-232.52H-763.75C-799.99-232.52-829.55-220.87-852.4-197.58-875.27-174.28-886.7-141.92-886.7-100.51L-889.7 0C-889.7 22.43-892.28 40.55-897.46 54.36-902.64 68.15-910.4 78.95-920.76 86.71-931.11 94.48-943.85 99.86-958.94 102.89-974.04 105.9-991.51 107.42-1011.35 107.42-1030.34 107.42-1050.18 105.9-1070.89 102.89-1091.6 99.86-1106.7 97.49-1116.18 95.77L-1113.19-104.39C-1113.19-150.98-1105.22-193.49-1089.24-231.87-1073.29-270.27-1050.22-303.06-1020-330.23-989.81-357.41-953.15-378.34-909.99-393-866.86-407.67-818.1-415-763.75-415H-346.44C-292.09-415-243.35-407.67-200.2-393-157.06-378.34-120.4-357.41-90.19-330.23-59.99-303.06-36.92-270.27-20.95-231.87-4.991-193.49 2.998-150.98 2.998-104.39Z\" fill=\"currentColor\"/><path transform=\"matrix(1,0,0,-1,1495.31,1152.76)\" d=\"M0 0C0-45.21-36.64-81.84-81.85-81.84-127.07-81.84-163.71-45.21-163.71 0-163.71 45.21-127.07 81.86-81.85 81.86-36.64 81.86 0 45.21 0 0\" fill=\"currentColor\"/><path transform=\"matrix(1,0,0,-1,1681.88,1152.76)\" d=\"M0 0C0-45.21-36.64-81.84-81.85-81.84-127.05-81.84-163.72-45.21-163.72 0-163.72 45.21-127.05 81.86-81.85 81.86-36.64 81.86 0 45.21 0 0\" fill=\"currentColor\"/><path transform=\"matrix(1,0,0,-1,1594.81,999.36)\" d=\"M0 0C0-45.21-36.65-81.86-81.86-81.86-127.07-81.86-163.71-45.21-163.71 0-163.71 45.21-127.07 81.84-81.86 81.84-36.65 81.84 0 45.21 0 0\" fill=\"currentColor\"/></g></svg>";

// Widths built by tools/optimize-images.py. Derivatives are never upscaled, so
// the ladder is clamped to each source's own width.
const IMG_WIDTHS = [800, 1600];
function widthsFor(srcW, extra) {
  const all = extra ? IMG_WIDTHS.concat(extra) : IMG_WIDTHS;
  return Array.from(new Set(all.map((w) => Math.min(w, srcW)))).sort((a, b) => a - b);
}

// AVIF with a WebP step and the original JPEG as the floor.
function Picture({ name, alt, srcW, extra, sizes, className, width, height, priority }) {
  const ws = widthsFor(srcW, extra);
  const set = (ext) => ws.map((w) => `images/opt/${name}-${w}.${ext} ${w}w`).join(', ');
  return (
    <picture>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        src={`images/${name}.jpg`}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : 'auto'}
        decoding="async"
      />
    </picture>
  );
}

// ─────────────── i18n ───────────────
const TRANSLATIONS = {
  en: {
    htmlLang: 'en',
    pageTitle: 'Sub Gourmet — Restaurant in Srebreno, Dubrovnik Riviera',
    pageDesc: 'All-day restaurant in Srebreno, Zupa Dubrovacka. Breakfast until 11:30, stone-baked pizza, pasta, burgers, grilled squid and cevapi. Open daily until 21:00.',
    nav: { about: 'About', menu: 'Menu', gallery: 'Gallery', visit: 'Visit', join: 'Join the Team' },
    hero: {
      eyebrow: 'Srebreno · Dubrovnik Riviera',
      h1Top: 'Sub',
      h1Bot: ['Gourm', 'e', 't'],
      tag: 'Mediterranean flavors, Adriatic soul, where the coast meets the table, slowly, the way it should.',
      viewMenu: 'View Menu',
      today: 'Today',
      todayValue: 'Open until 9 PM',
      reviewed: 'Reviewed',
      reviewedValue: GOOGLE_REVIEWS + ' Google reviews',
      perPerson: 'Per person',
      scroll: 'Scroll',
    },
    about: {
      eyebrow: 'Our Story',
      h2a: 'A small kitchen with the ',
      h2em: 'whole sea',
      h2b: ' beside it.',
      lead: 'In Srebreno, a quiet bay just east of Dubrovnik, we cook the way our grandmothers did, and the way travelers wished they could.',
      p1: 'Our kitchen runs all day: pizza baked to order, tagliatelle in truffle sauce, grilled squid and fish and chips, burgers on brioche buns, ćevapi with warm flat bread.',
      p2: 'Breakfast is served until 11:30. The cakes and desserts are made in house.',
      stat1Num: '12', stat1Lbl: 'Years on the bay',
      stat2Num: '81', stat2Lbl: 'Dishes on the menu',
      stat3Num: GOOGLE_RATING + '★', stat3Lbl: GOOGLE_REVIEWS + ' Google reviews',
      stampEst: 'Established', stampSince: 'Since 2014',
      imgAlt: 'Dining room at Sub Gourmet, Srebreno',
    },
    menu: {
      eyebrow: 'The Menu',
      h2a: 'Every plate tells a story ',
      h2em: 'of the coast.',
      hoursLabel: 'Hours',
      calloutA: 'Allergies, dietary requests, ',
      calloutEm: 'or a bottle from the cellar?',
      calloutBody: 'Our team is happy to walk you through everything. Most pasta and risotto can be prepared gluten-free; vegetarian options are marked on request.',
      calloutCta: 'Talk to us',
    },
    callFab: {
      label: 'Call the restaurant',
      copied: 'Number copied',
    },
    gallery: {
      eyebrow: 'The Room & The Plate',
      h2a: 'Where the ',
      h2em: 'Adriatic',
      h2b: ' meets the table.',
      showMore: 'Show all photos',
      viewLarger: 'View larger',
      close: 'Close',
      prev: 'Previous photo',
      next: 'Next photo',
    },
    visit: {
      eyebrow: 'Find Us',
      h2a: 'A short walk from the sea, ',
      h2em: 'a long stay at the table.',
      address: 'Address',
      addressLine1: 'Šetalište dr. Franje Tuđmana 2A',
      addressLine2: '20207 Župa Dubrovačka, Croatia',
      addressLocated: 'Restaurant in Sub City shopping center, 1st floor',
      hours: 'Hours',
      hoursValue: 'Open daily · until 9 PM',
      hoursSmall: 'Breakfast served 09:00 – 11:30',
      phone: 'Phone',
      whatsapp: 'WhatsApp',
      atTable: 'At the Table',
      tagTakeaway: 'Takeaway',
      tagDelivery: 'Delivery',
      tagVegetarian: 'Vegetarian options',
      tagWalkIn: 'Walk-ins welcome',
      perPerson: 'Per Person',
      mapBay: 'Srebreno Bay',
      mapPlaceA: 'Just off the promenade,',
      mapPlaceEm: 'two minutes from the sea.',
      mapDirections: 'Open in Maps',
    },
    footer: {
      tag: 'Mediterranean flavors, Adriatic soul. Open daily, sun to sunset, in Srebreno on the Dubrovnik Riviera.',
      visit: 'Visit',
      lAbout: 'About', lMenu: 'Menu', lGallery: 'Gallery', lFindUs: 'Find us',
      contact: 'Contact',
      follow: 'Follow',
      copyright: '© 2026 Sub Gourmet · Srebreno, Croatia',
      designed: 'Designed with care on the Adriatic',
    },
  },
  hr: {
    htmlLang: 'hr',
    pageTitle: 'Sub Gourmet — Restoran u Srebrenom, Župa Dubrovačka',
    pageDesc: 'Restoran u Srebrenom na Dubrovačkoj rivijeri. Doručak do 11:30, pizza iz peći, tjestenine, burgeri, lignje sa žara i ćevapi. Otvoreno svaki dan do 21:00.',
    nav: { about: 'O nama', menu: 'Meni', gallery: 'Galerija', visit: 'Posjetite nas', join: 'Postani dio tima' },
    hero: {
      eyebrow: 'Srebreno · Dubrovačka rivijera',
      h1Top: 'Sub',
      h1Bot: ['Gourm', 'e', 't'],
      tag: 'Mediteranski okusi, jadranska duša, gdje se obala susreće sa stolom, polako, onako kako treba.',
      viewMenu: 'Pogledajte meni',
      today: 'Danas',
      todayValue: 'Otvoreno do 21h',
      reviewed: 'Ocjenjeno',
      reviewedValue: GOOGLE_REVIEWS + ' Google recenzija',
      perPerson: 'Po osobi',
      scroll: 'Pomakni',
    },
    about: {
      eyebrow: 'Naša priča',
      h2a: 'Mala kuhinja s ',
      h2em: 'cijelim morem',
      h2b: ' pored sebe.',
      lead: 'U Srebrenom, tihoj uvali istočno od Dubrovnika, kuhamo kao što su naše bake, i kako su putnici poželjeli da znaju.',
      p1: 'Naša kuhinja radi cijeli dan: pizza pečena po narudžbi, tagliatelle u umaku od tartufa, lignje sa žara i fish and chips, burgeri u brioche pecivu, ćevapi s toplom lepinjom.',
      p2: 'Doručak se poslužuje do 11:30. Kolači i deserti su domaći.',
      stat1Num: '12', stat1Lbl: 'Godina u uvali',
      stat2Num: '81', stat2Lbl: 'Jela na jelovniku',
      stat3Num: GOOGLE_RATING + '★', stat3Lbl: GOOGLE_REVIEWS + ' Google recenzija',
      stampEst: 'Osnovano', stampSince: 'Od 2014.',
      imgAlt: 'Blagovaonica Sub Gourmeta u Srebrenom',
    },
    menu: {
      eyebrow: 'Meni',
      h2a: 'Svaki tanjur priča priču ',
      h2em: 'o obali.',
      hoursLabel: 'Radno vrijeme',
      calloutA: 'Alergije, posebne želje, ',
      calloutEm: 'ili boca iz vinarije?',
      calloutBody: 'Naš tim će vas rado provesti kroz sve. Većina tjestenina i rižota može se pripremiti bez glutena; vegetarijanske opcije dostupne su na upit.',
      calloutCta: 'Razgovarajte s nama',
    },
    callFab: {
      label: 'Nazovite restoran',
      copied: 'Broj kopiran',
    },
    gallery: {
      eyebrow: 'Prostor i tanjur',
      h2a: 'Gdje se ',
      h2em: 'Jadran',
      h2b: ' susreće sa stolom.',
      showMore: 'Pogledaj sve fotografije',
      viewLarger: 'Prikaži veće',
      close: 'Zatvori',
      prev: 'Prethodna fotografija',
      next: 'Sljedeća fotografija',
    },
    visit: {
      eyebrow: 'Pronađite nas',
      h2a: 'Kratko od mora, ',
      h2em: 'dugo za stolom.',
      address: 'Adresa',
      addressLine1: 'Šetalište dr. Franje Tuđmana 2A',
      addressLine2: '20207 Župa Dubrovačka, Hrvatska',
      addressLocated: 'Restoran u trgovačkom centru Sub City, 1. kat',
      hours: 'Radno vrijeme',
      hoursValue: 'Otvoreno svaki dan · do 21h',
      hoursSmall: 'Doručak posluženo 09:00 – 11:30',
      phone: 'Telefon',
      whatsapp: 'WhatsApp',
      atTable: 'Za stolom',
      tagTakeaway: 'Hrana za van',
      tagDelivery: 'Dostava',
      tagVegetarian: 'Vegetarijanske opcije',
      tagWalkIn: 'Dobrodošli i bez rezervacije',
      perPerson: 'Po osobi',
      mapBay: 'Uvala Srebreno',
      mapPlaceA: 'Tik uz šetnicu,',
      mapPlaceEm: 'dvije minute od mora.',
      mapDirections: 'Otvori u kartama',
    },
    footer: {
      tag: 'Mediteranski okusi, jadranska duša. Otvoreno svaki dan, od sunca do zalaska, u Srebrenom na Dubrovačkoj rivijeri.',
      visit: 'Posjetite',
      lAbout: 'O nama', lMenu: 'Meni', lGallery: 'Galerija', lFindUs: 'Pronađite nas',
      contact: 'Kontakt',
      follow: 'Pratite nas',
      copyright: '© 2026 Sub Gourmet · Srebreno, Hrvatska',
      designed: 'Stvoreno s ljubavlju na Jadranu',
    },
  },
};

function useLang() {
  const [lang, setLangState] = useState(() => {
    try {
      const stored = localStorage.getItem('subgourmet-lang');
      if (stored === 'en' || stored === 'hr') return stored;
      const browser = (navigator.language || '').toLowerCase();
      return browser.startsWith('hr') ? 'hr' : 'en';
    } catch (e) { return 'en'; }
  });
  const setLang = (l) => {
    setLangState(l);
    try { localStorage.setItem('subgourmet-lang', l); } catch (e) {}
  };
  useEffect(() => {
    document.documentElement.setAttribute('lang', TRANSLATIONS[lang].htmlLang);
    document.title = TRANSLATIONS[lang].pageTitle;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', TRANSLATIONS[lang].pageDesc);
  }, [lang]);
  return [lang, setLang];
}

function Logo() {
  return (
    <span
      className="nav-logo"
      role="img"
      aria-label="Sub Gourmet"
      dangerouslySetInnerHTML={{ __html: LOGO_SVG }}
    />
  );
}

function LangToggle({ lang, setLang }) {
  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button
        type="button"
        className={'lang-btn' + (lang === 'en' ? ' active' : '')}
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
      >EN</button>
      <span className="lang-sep" aria-hidden="true">·</span>
      <button
        type="button"
        className={'lang-btn' + (lang === 'hr' ? ' active' : '')}
        onClick={() => setLang('hr')}
        aria-pressed={lang === 'hr'}
      >HR</button>
    </div>
  );
}

function Nav({ scrolled, dark, lang, setLang, t }) {
  const cls = ['nav'];
  if (scrolled) cls.push('scrolled');
  if (dark && !scrolled) cls.push('dark-bg');
  return (
    <nav className={cls.join(' ')}>
      <a href="#top" aria-label="Sub Gourmet"><Logo /></a>
      <div className="nav-links">
        <a href="#about">{t.nav.about}</a>
        <a href="#menu">{t.nav.menu}</a>
        <a href="#gallery">{t.nav.gallery}</a>
        <a href="#visit">{t.nav.visit}</a>
        <a className="nav-join" href={CAREERS_URL}>{t.nav.join}</a>
      </div>
      <div className="nav-right">
        <LangToggle lang={lang} setLang={setLang} />
      </div>
      <button className="nav-menu-btn" onClick={() => {
        document.querySelector('#menu').scrollIntoView({behavior:'smooth'});
      }}>
        {t.nav.menu}
      </button>
    </nav>
  );
}

function Hero({ t }) {
  const [a, b, c] = t.hero.h1Bot;
  return (
    <section className="hero" id="top">
      <div className="hero-bg">
        <Picture name={HERO_IMAGE} alt="" srcW={2200} extra={[2200]} sizes="100vw" className="hero-bg-img" priority />
        <div className="hero-bg-tint" aria-hidden="true"></div>
      </div>
      <div className="hero-inner">
        <div>
          <div className="hero-eyebrow mono">
            <span className="line"></span>
            <span>{t.hero.eyebrow}</span>
          </div>
          <h1>{t.hero.h1Top}<br/>{a}<span className="amp">{b}</span>{c}</h1>
          <p className="hero-tag">{t.hero.tag}</p>
          <div className="hero-ctas">
            <a href="#menu" className="btn btn-primary">{t.hero.viewMenu} <span className="arrow"></span></a>
          </div>
          <div className="hero-meta">
            <div className="hero-meta-item">
              <span className="hero-meta-label">{t.hero.today}</span>
              <span className="hero-meta-value"><span className="gold">●</span> {t.hero.todayValue}</span>
            </div>
            <div className="hero-meta-item">
              <span className="hero-meta-label">{t.hero.reviewed}</span>
              <span className="hero-meta-value"><span className="gold">★</span> {GOOGLE_RATING} <span className="dot">·</span> {t.hero.reviewedValue}</span>
            </div>
            <div className="hero-meta-item">
              <span className="hero-meta-label">{t.hero.perPerson}</span>
              <span className="hero-meta-value">10€ – 15€</span>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-corner mono">
        <span>{t.hero.scroll}</span>
        <span className="scroll-line"></span>
      </div>
    </section>
  );
}

function About({ t }) {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-img reveal">
            <Picture name={ABOUT_IMAGE} alt={t.about.imgAlt} srcW={1800} sizes="(max-width: 960px) 92vw, 40vw" />
            <div className="stamp">
              <span className="small">{t.about.stampEst}</span>
              {t.about.stampSince}
            </div>
          </div>
          <div className="reveal">
            <div className="section-head" style={{marginBottom: 32}}>
              <span className="eyebrow mono"><span className="line"></span><span>{t.about.eyebrow}</span></span>
              <h2>{t.about.h2a}<em>{t.about.h2em}</em>{t.about.h2b}</h2>
            </div>
            <div className="about-copy">
              <p className="lead">{t.about.lead}</p>
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
            </div>
            <div className="about-stats">
              <div className="about-stat">
                <div className="num">{t.about.stat1Num}</div>
                <div className="lbl">{t.about.stat1Lbl}</div>
              </div>
              <div className="about-stat">
                <div className="num">{t.about.stat2Num}</div>
                <div className="lbl">{t.about.stat2Lbl}</div>
              </div>
              <div className="about-stat">
                <div className="num">{t.about.stat3Num}</div>
                <div className="lbl">{t.about.stat3Lbl}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MenuSection({ lang, t }) {
  const [active, setActive] = useState('breakfast');
  const current = MENU.find(m => m.id === active);
  const primaryLang = lang === 'hr' ? 'hr' : 'en';
  const itemDesc = (item) => lang === 'hr' ? (item.descHr || item.desc) : item.desc;
  const sectionNote = (m) => lang === 'hr' ? (m.noteHr || m.note) : m.note;
  const sectionHours = (m) => lang === 'hr' ? (m.hoursHr || m.hours) : m.hours;
  return (
    <section className="menu" id="menu">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow mono"><span className="line"></span><span>{t.menu.eyebrow}</span></span>
          <h2>{t.menu.h2a}<em>{t.menu.h2em}</em></h2>
        </div>
        <div className="menu-tabs reveal" role="tablist">
          {MENU.map(m => (
            <button
              key={m.id}
              className={'menu-tab' + (active === m.id ? ' active' : '')}
              onClick={() => setActive(m.id)}
              role="tab"
              aria-selected={active === m.id}
            >{m[primaryLang]}</button>
          ))}
        </div>
        <label htmlFor="menu-category-select" className="sr-only">{t.menu.eyebrow}</label>
        <select
          id="menu-category-select"
          className="menu-tabs-select reveal"
          value={active}
          onChange={e => setActive(e.target.value)}
        >
          {MENU.map(m => (
            <option key={m.id} value={m.id}>{m[primaryLang]}</option>
          ))}
        </select>

        <div className="menu-section-meta reveal">
          <h3>{current[primaryLang]}</h3>
          <div className="hours">
            {current.hours ? <><span className="gold">{t.menu.hoursLabel}</span> · {sectionHours(current)}</> : sectionNote(current)}
          </div>
        </div>

        <div className="menu-grid reveal">
          {current.items.map((item, i) => (
            <div key={i} className={'menu-item' + (item.signature ? ' signature' : '')}>
              <div>
                <div className="menu-item-name">
                  {item[primaryLang]}
                </div>
                {item.desc && <div className="menu-item-desc">{itemDesc(item)}</div>}
              </div>
              <div className="menu-item-price">{item.price}€</div>
            </div>
          ))}
        </div>

        <div className="menu-callout reveal">
          <div>
            <div className="serif">{t.menu.calloutA}<em>{t.menu.calloutEm}</em></div>
            <p>{t.menu.calloutBody}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Gallery: 26 photos total. First 9 shown by default; rest revealed by "Show all photos".
// `name` is the base filename; Picture resolves it to images/opt/<name>-<w>.<ext>
// with images/<name>.jpg as the fallback. w/h are the source pixel dimensions,
// used both as <img> aspect hints (preventing column rebalancing in the masonry
// layout) and as the ceiling for the srcset ladder.
const L = { w: 1800, h: 1200 };   // landscape food shots
const P = { w: 1200, h: 1800 };   // portrait food shots
const W = { w: 2200, h: 1466 };   // wide hero photo (p1)
const GALLERY = [
  // Initial 9
  { name: 'p3',  ...L, alt: 'Sub Gourmet dining room with tables and mustard velvet chairs', altHr: 'Blagovaonica Sub Gourmeta sa stolovima i žutim baršunastim stolicama' },
  { name: 'f5',  ...P, alt: 'Spaghetti in tomato sauce with fresh basil, served by the window', altHr: 'Špageti u umaku od rajčice sa svježim bosiljkom, posluženi uz prozor' },
  { name: 'f1',  ...L, alt: 'Sub Gourmet pizza with prosciutto, rocket and grana padano', altHr: 'Sub Gourmet pizza s pršutom, rikulom i grana padanom' },
  { name: 'f3',  ...L, alt: 'Omelette served with green salad and tomato', altHr: 'Omlet poslužen sa zelenom salatom i rajčicom' },
  { name: 'f10', ...L, alt: 'Tagliatelle in truffle cream sauce with warm flat bread', altHr: 'Tagliatelle u kremastom umaku od tartufa s toplom lepinjom' },
  { name: 'f15', ...P, alt: 'Spaghetti with tomato sauce twirled on a fork', altHr: 'Špageti s umakom od rajčice namotani na vilicu' },
  { name: 'f8',  ...L, alt: 'Omelette with cherry tomatoes and salad on a wooden table', altHr: 'Omlet s cherry rajčicama i salatom na drvenom stolu' },
  { name: 'f4',  ...L, alt: 'Greek salad with feta, olives, cucumber and tomato', altHr: 'Grčka salata s fetom, maslinama, krastavcem i rajčicom' },
  { name: 'f17', ...L, alt: 'Funghi pizza with mushrooms and mozzarella', altHr: 'Funghi pizza s gljivama i mozzarellom' },
  // Revealed by "Show all photos"
  { name: 'p1',  ...W, alt: 'Sub Gourmet dining room with floor-to-ceiling windows', altHr: 'Blagovaonica Sub Gourmeta s prozorima od poda do stropa' },
  { name: 'p2',  ...L, alt: 'Dining tables with velvet chairs beside the window', altHr: 'Stolovi s baršunastim stolicama uz prozor' },
  { name: 'f2',  ...L, alt: 'Chicken tortilla wrap served with salad', altHr: 'Tortilja s piletinom poslužena sa salatom' },
  { name: 'f6',  ...L, alt: 'Cream of pumpkin soup finished with cream', altHr: 'Krem juha od tikve dovršena vrhnjem' },
  { name: 'f7',  ...P, alt: 'Fishburger on a sesame brioche bun with lettuce and tomato', altHr: 'Fishburger u brioche pecivu sa sezamom, zelenom salatom i rajčicom' },
  { name: 'f9',  ...L, alt: 'Ćevapi with flat bread and ajvar', altHr: 'Ćevapi s lepinjom i ajvarom' },
  { name: 'f11', ...P, alt: 'Tagliatelle in truffle sauce with a glass of white wine', altHr: 'Tagliatelle u umaku od tartufa uz čašu bijelog vina' },
  { name: 'f12', ...L, alt: 'Tagliatelle with mushrooms and truffle cream sauce', altHr: 'Tagliatelle s gljivama i kremastim umakom od tartufa' },
  { name: 'f13', ...L, alt: 'Spring rolls with sweet chilli dip', altHr: 'Proljetne rolice s umakom sweet chilli' },
  { name: 'f14', ...L, alt: 'Breaded shrimp tails and spring rolls on a slate board', altHr: 'Panirani repovi kozica i proljetne rolice na kamenoj ploči' },
  { name: 'f16', ...P, alt: 'Two pizzas seen from above, vegetable and cheese', altHr: 'Dvije pizze odozgo, povrtna i sirna' },
  { name: 'f18', ...L, alt: 'Grilled chicken fillet with grilled Mediterranean vegetables', altHr: 'Pileći file sa žara s mediteranskim povrćem sa žara' },
  { name: 'f19', ...L, alt: 'Beef burger with a fried egg, lettuce and tomato', altHr: 'Burger od junetine s jajem, zelenom salatom i rajčicom' },
  { name: 'f20', ...L, alt: 'Slavonic breakfast with fried eggs, sausage and salad', altHr: 'Slavonski doručak s jajima na oko, kobasicom i salatom' },
  { name: 'f21', ...L, alt: 'Dubrovnik breakfast with prosciutto, fritters and salads', altHr: 'Dubrovački doručak s pršutom, uštipcima i salatama' },
  { name: 'f22', ...L, alt: 'A spread of breakfast plates and salads seen from above', altHr: 'Odozgo snimljen izbor doručaka i salata' },
  { name: 'f23', ...L, alt: 'Table set with pasta dishes and menus', altHr: 'Stol postavljen s tjesteninama i jelovnicima' },
];
const GALLERY_INITIAL = 9;

// Fullscreen photo viewer. `index` is a position in `photos`; null means closed.
function Lightbox({ photos, index, onClose, onNavigate, t }) {
  const open = index !== null;

  // Escape to close, arrows to navigate. Rebound whenever the index changes so
  // the handler always sees the current position.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onNavigate(-1);
      else if (e.key === 'ArrowRight') onNavigate(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, index, onClose, onNavigate]);

  // Lock background scroll while the viewer is up.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;
  const photo = photos[index];

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={photo.alt} onClick={onClose}>
      <button type="button" className="lightbox-close" aria-label={t.gallery.close} onClick={onClose}>&times;</button>

      <button
        type="button"
        className="lightbox-nav prev"
        aria-label={t.gallery.prev}
        onClick={(e) => { e.stopPropagation(); onNavigate(-1); }}
      >&#8249;</button>

      {/* Stop propagation so clicking the photo itself doesn't dismiss. */}
      <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
        <Picture name={photo.name} alt={photo.alt} srcW={photo.w} width={photo.w} height={photo.h} sizes="(max-width: 960px) 96vw, 88vw" priority />
        <figcaption className="lightbox-caption mono">
          <span>{photo.alt}</span>
          <span className="lightbox-count">{index + 1} / {photos.length}</span>
        </figcaption>
      </figure>

      <button
        type="button"
        className="lightbox-nav next"
        aria-label={t.gallery.next}
        onClick={(e) => { e.stopPropagation(); onNavigate(1); }}
      >&#8250;</button>
    </div>
  );
}

function Gallery({ t }) {
  const altOf = (img) => (t.htmlLang === 'hr' ? img.altHr : img.alt);
  const [expanded, setExpanded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const visible = expanded ? GALLERY : GALLERY.slice(0, GALLERY_INITIAL);

  // Navigation wraps around the set the visitor can currently see.
  const navigate = (step) =>
    setLightboxIndex((i) => (i === null ? i : (i + step + visible.length) % visible.length));

  return (
    <section className="gallery dark" id="gallery">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow mono"><span className="line"></span><span>{t.gallery.eyebrow}</span></span>
          <h2>{t.gallery.h2a}<em>{t.gallery.h2em}</em>{t.gallery.h2b}</h2>
        </div>
        <div className="gallery-grid reveal">
          {visible.map((img, i) => (
            <button
              key={img.name}
              type="button"
              className="gallery-item"
              aria-label={t.gallery.viewLarger + ': ' + altOf(img)}
              onClick={() => setLightboxIndex(i)}
            >
              <Picture name={img.name} alt={altOf(img)} srcW={img.w} width={img.w} height={img.h}
                sizes="(max-width: 520px) 92vw, (max-width: 960px) 46vw, 30vw" />
              <span className="gallery-item-zoom" aria-hidden="true"></span>
            </button>
          ))}
        </div>
        {!expanded && (
          <div className="gallery-more reveal">
            <button type="button" className="btn btn-primary" onClick={() => setExpanded(true)}>
              {t.gallery.showMore} <span className="arrow"></span>
            </button>
          </div>
        )}
      </div>
      <Lightbox
        photos={visible.map((g) => ({ ...g, alt: altOf(g) }))}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={navigate}
        t={t}
      />
    </section>
  );
}

// Floating call button (mobile only). Tapping copies the number to the
// clipboard and then lets the tel: link open the dialer.
function CallFab({ t }) {
  const [copied, setCopied] = useState(false);

  const copy = (text) => {
    // The async Clipboard API needs a secure context; fall back to a hidden
    // textarea so the copy still works over plain http on a local network.
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-9999px;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      ok ? resolve() : reject();
    });
  };

  // No preventDefault: the anchor's tel: navigation still runs and opens the
  // dialer. The write is started inside the gesture, so it stays permitted.
  const onClick = () => {
    copy(PHONE_DISPLAY).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      },
      () => {}
    );
  };

  return (
    <a
      className="call-fab"
      href={'tel:' + PHONE_E164}
      onClick={onClick}
      aria-label={t.callFab.label + ' ' + PHONE_DISPLAY}
    >
      <svg className="call-fab-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 013 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.3 2.2z"
        />
      </svg>
      <span className={'call-fab-toast' + (copied ? ' show' : '')} aria-hidden="true">
        {t.callFab.copied}
      </span>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? t.callFab.copied : ''}
      </span>
    </a>
  );
}

function Visit({ t }) {
  return (
    <section className="visit" id="visit">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow mono"><span className="line"></span><span>{t.visit.eyebrow}</span></span>
          <h2>{t.visit.h2a}<em>{t.visit.h2em}</em></h2>
        </div>
        <div className="visit-grid">
          <div className="visit-info reveal">
            <div className="visit-block">
              <span className="label">{t.visit.address}</span>
              <span className="value">{t.visit.addressLine1}<br/>{t.visit.addressLine2}</span>
              <span className="value small">{t.visit.addressLocated}</span>
            </div>
            <div className="visit-block">
              <span className="label">{t.visit.hours}</span>
              <span className="value">{t.visit.hoursValue}</span>
              <span className="value small">{t.visit.hoursSmall}</span>
            </div>
            <div className="visit-block">
              <span className="label">{t.visit.phone}</span>
              <a className="value" href="tel:+38520642111">+385 20 642 111</a>
            </div>
            <div className="visit-block">
              <span className="label">{t.visit.whatsapp}</span>
              <a className="value" href="https://wa.me/385914009999" target="_blank" rel="noreferrer">+385 91 400 9999</a>
            </div>
            <div className="visit-block">
              <span className="label">{t.visit.atTable}</span>
              <div className="visit-tags">
                <span className="visit-tag">{t.visit.tagTakeaway}</span>
                <span className="visit-tag">{t.visit.tagDelivery}</span>
                <span className="visit-tag">{t.visit.tagVegetarian}</span>
                <span className="visit-tag">{t.visit.tagWalkIn}</span>
              </div>
            </div>
            <div className="visit-block">
              <span className="label">{t.visit.perPerson}</span>
              <span className="value">10€ – 15€</span>
            </div>
          </div>

          <div className="visit-map reveal">
            <iframe
              className="map-frame"
              src="https://maps.google.com/maps?q=%C5%A0etali%C5%A1te+dr.+Franje+Tu%C4%91mana+2A%2C+20207+%C5%BDupa+Dubrova%C4%8Dka&t=&z=16&ie=UTF8&iwloc=&output=embed"
              title="Sub Gourmet — Šetalište dr. Franje Tuđmana 2A, Župa Dubrovačka"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="map-overlay-top">
              <div className="mono" style={{color: 'rgba(245,240,232,0.85)'}}>
                <span style={{color: 'var(--gold)'}}>●</span> {t.visit.mapBay}
              </div>
            </div>
            <a
              href="https://maps.google.com/?q=Šetalište+dr.+Franje+Tuđmana+2A+Župa+Dubrovačka"
              target="_blank"
              rel="noreferrer"
              className="map-directions map-directions-float"
            >
              {t.visit.mapDirections} <span style={{fontSize: 14}}>↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ t }) {
  return (
    <footer>
      <div className="container">
        <div className="foot-top">
          <div>
            <div
              className="foot-brand"
              role="img"
              aria-label="Sub Gourmet"
              dangerouslySetInnerHTML={{ __html: LOGO_SVG }}
            />
            <p className="foot-tag">{t.footer.tag}</p>
          </div>
          <div className="foot-col">
            <h5>{t.footer.visit}</h5>
            <ul>
              <li><a href="#about">{t.footer.lAbout}</a></li>
              <li><a href="#menu">{t.footer.lMenu}</a></li>
              <li><a href="#gallery">{t.footer.lGallery}</a></li>
              <li><a href="#visit">{t.footer.lFindUs}</a></li>
              <li><a href={CAREERS_URL}>{t.nav.join}</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>{t.footer.contact}</h5>
            <ul>
              <li><a href="tel:+38520642111">+385 20 642 111</a></li>
              <li><a href="https://wa.me/385914009999" target="_blank" rel="noreferrer">+385 91 400 9999 (WhatsApp)</a></li>
              <li><a href={'mailto:' + EMAIL}>{EMAIL}</a></li>
              <li>Šetalište dr. Franje Tuđmana 2A</li>
              <li>20207 Župa Dubrovačka, {t.htmlLang === 'hr' ? 'Hrvatska' : 'Croatia'}</li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>{t.footer.follow}</h5>
            <div className="foot-social">
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.7" fill="currentColor"/></svg>
              </a>
              <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" aria-label="Facebook">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M14 9h3V6h-3a3 3 0 0 0-3 3v2H8v3h3v7h3v-7h3l1-3h-4V9z"/></svg>
              </a>
            </div>
            <p style={{fontSize: 13, marginTop: 14}}>
              <a className="foot-handle" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">{SOCIAL_HANDLE}</a>
            </p>
          </div>
        </div>
        <div className="foot-bottom">
          <span>{t.footer.copyright}</span>
          <span>{t.footer.designed}</span>
        </div>
      </div>
    </footer>
  );
}

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(true);
  const [lang, setLang] = useLang();
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
      const gallery = document.getElementById('gallery');
      const galleryRect = gallery ? gallery.getBoundingClientRect() : null;
      const overHero = y < window.innerHeight - 80;
      const overGallery = galleryRect && galleryRect.top < 60 && galleryRect.bottom > 60;
      setOverDark(overHero || overGallery);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });

  return (
    <>
      <Nav scrolled={scrolled} dark={overDark} lang={lang} setLang={setLang} t={t} />
      <Hero t={t} />
      <About t={t} />
      <MenuSection lang={lang} t={t} />
      <Gallery t={t} />
      <Visit t={t} />
      <Footer t={t} />
      <CallFab t={t} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
