/**
 * Hand-drawn Porsche 911 GT3 RS (991.2) outlines for the three camera views.
 *
 * All views share one drawing space: the car is centred on x = CX and the
 * tyres touch the ground at y = GROUND, so the camera can frame any view (or
 * any part of one) with the same maths. The side view faces right.
 */
export type Point = [number, number];

export const CX = 685;
export const GROUND = 778;

type Seg = { to: Point; c1?: Point; c2?: Point };

const pt = ([x, y]: Point) => `${x} ${y}`;
const flip = ([x, y]: Point): Point => [2 * CX - x, y];
const fwd = (s: Seg) => (s.c1 && s.c2 ? ` C ${pt(s.c1)} ${pt(s.c2)} ${pt(s.to)}` : ` L ${pt(s.to)}`);
/** Segment i of a half outline, mirrored and walked backwards (ending at the mirror of its start point). */
const back = (segs: Seg[], start: Point, i: number) => {
  const s = segs[i];
  const to = flip(i === 0 ? start : segs[i - 1].to);
  return s.c1 && s.c2 ? ` C ${pt(flip(s.c2))} ${pt(flip(s.c1))} ${pt(to)}` : ` L ${pt(to)}`;
};

/** Closes the right half of a symmetric outline (drawn top-centre → bottom-centre) into a full shape. */
function mirrored(start: Point, segs: Seg[]): string {
  let d = `M ${pt(start)}` + segs.map(fwd).join("");
  for (let i = segs.length - 1; i >= 0; i--) d += back(segs, start, i);
  return `${d} Z`;
}

/** The same half outline drawn left → right across the top, for rim lighting. */
function across(start: Point, segs: Seg[]): string {
  let d = `M ${pt(flip(segs[segs.length - 1].to))}`;
  for (let i = segs.length - 1; i >= 0; i--) d += back(segs, start, i);
  return d + segs.map(fwd).join("");
}

/** Points along a circular arc, for building clip regions around wheel arches. */
function arc(cx: number, cy: number, r: number, fromDeg: number, toDeg: number, steps = 14): string {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const a = ((fromDeg + ((toDeg - fromDeg) * i) / steps) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" L ");
}

/* ------------------------------------------------------------------ side */

const SIDE_TOP_LINE =
  "M 1262 604 C 1245 597 1215 582 1180 562 C 1160 552 1140 546 1120 542 C 1060 528 990 514 930 510 L 905 503 " +
  "C 870 482 810 450 752 423 C 720 409 680 402 630 401 C 580 403 540 408 500 415 C 440 426 380 438 330 450 " +
  "C 290 462 255 478 225 490 C 190 503 150 518 118 534";

export const SIDE = {
  body:
    "M 1302 726 L 1296 716 C 1288 706 1285 695 1290 680 C 1296 665 1301 652 1299 642 C 1294 628 1280 612 1262 604 " +
    SIDE_TOP_LINE.slice("M 1262 604 ".length) +
    " C 100 543 86 552 80 562 C 73 575 70 595 71 615 C 72 640 76 660 74 684 C 76 692 84 696 100 698 " +
    "C 140 708 190 720 238 728 A 118 118 0 1 1 449 745 L 953 745 A 122 122 0 1 1 1179 745 L 1190 750 " +
    "C 1230 748 1270 742 1302 732 Z",
  topLine: SIDE_TOP_LINE,
  wheels: {
    rear: { cx: 346, cy: 677, tyre: 101, rim: 80, caliper: 330 },
    front: { cx: 1062, cy: 686, tyre: 92, rim: 74, caliper: 185 },
  },
  greenhouse:
    "M 356 494 C 360 484 380 474 420 463 C 470 450 540 437 600 434 C 660 431 700 434 730 446 " +
    "C 755 457 780 480 800 510 L 796 516 L 560 516 C 500 514 420 508 356 494 Z",
  quarterGlass: "M 368 493 C 380 484 410 474 440 466 C 480 456 510 449 532 446 L 536 510 C 480 507 420 503 368 493 Z",
  quarterBox: [366, 444, 172, 68] as [number, number, number, number],
  doorGlass: "M 558 444 C 620 437 680 436 720 447 C 742 456 760 472 772 488 L 750 490 L 748 512 L 558 512 Z",
  doorBox: [556, 434, 218, 80] as [number, number, number, number],
  mirrorSail: "M 750 490 L 775 489 L 794 512 L 748 512 Z",
  mirrorCap: "M 780 505 C 782 495 800 494 822 500 C 840 506 846 522 840 535 C 834 548 812 552 796 546 C 784 540 778 520 780 505 Z",
  doorFront: "M 868 520 C 900 540 916 560 916 600 C 916 640 912 680 904 725",
  doorRear: "M 548 516 C 540 540 545 600 566 640 C 578 662 590 690 596 722",
  doorHandle: "M 560 572 C 580 566 620 566 632 574 C 634 582 626 588 600 588 C 575 588 556 584 560 572 Z",
  bumperSeam: "M 1146 562 C 1158 600 1178 640 1186 700",
  fenderFlare: "M 934 652 A 140 140 0 0 1 1007 573",
  sill: "M 462 722 L 945 726 L 950 745 L 452 745 Z",
  sideIntake:
    "M 430 534 C 450 530 490 538 508 546 C 520 560 528 590 526 606 C 524 616 510 618 500 612 C 480 598 452 572 434 552 C 426 544 424 536 430 534 Z",
  tailLight: "M 94 550 L 200 558 Q 210 561 204 567 L 104 571 Q 92 571 93 560 Z",
  diffuser: "M 74 670 C 120 680 190 700 238 712 L 238 728 C 190 720 140 708 100 698 C 84 696 76 692 74 684 Z",
  rearCrease: "M 80 606 C 130 612 190 618 243 628",
  reflector: "M 84 632 L 146 642 L 148 650 L 86 640 Z",
  deckLip: "M 322 458 C 282 474 236 494 186 512",
  wingUpright: "M 188 500 C 194 482 199 466 203 451 L 221 449 C 218 466 215 480 212 492 Z",
  wingEndplate: "M 68 411 L 214 409 Q 246 412 250 430 Q 252 446 234 449 L 110 462 Q 88 465 84 482 Q 76 450 68 411 Z",
  wingPlane: "M 76 419 C 130 413 200 413 238 427 C 246 431 244 439 234 440 C 190 437 130 429 80 425 Z",
  headlight:
    "M 1138 547 C 1165 555 1215 580 1236 596 C 1242 604 1240 616 1230 618 C 1205 612 1165 588 1146 566 C 1138 558 1134 550 1138 547 Z",
  frontIntake: "M 1262 650 L 1292 656 C 1286 680 1276 705 1266 718 L 1248 716 C 1252 695 1256 670 1262 650 Z",
  frontLip: "M 1180 740 C 1230 738 1270 732 1302 724 L 1302 730 C 1270 740 1230 748 1190 750 Z",
  /** Upper front fender, between the door and bumper, down to the wheel arch (ceramic demo). */
  fenderPanel: `M 866 470 L 1150 470 L 1150 560 L 1162 600 L 1178 642 L ${arc(1066, 700, 126, -18, -162)} L 916 650 L 916 600 L 900 545 L 866 520 Z`,
  /** Where the PPF demo's rock strikes the bumper. */
  bumperImpact: [1296, 668] as Point,
  /** PPF coverage regions, clipped to the body when drawn. */
  ppf: {
    partial: "M 1036 380 C 1040 470 1050 530 1062 580 L 1062 800 L 1600 800 L 1600 380 Z",
    "full-front": "M 862 380 L 868 520 C 900 540 916 560 916 600 C 916 640 912 680 904 725 L 904 800 L 1600 800 L 1600 380 Z",
    "full-body": "M 0 380 L 1600 380 L 1600 800 L 0 800 Z",
  } as Record<string, string>,
  /** The visible edge of the film for each coverage level (none for full body). */
  ppfEdge: {
    partial: "M 1036 470 C 1040 520 1048 552 1058 578",
    "full-front": "M 868 520 C 900 540 916 560 916 600 C 916 640 912 680 904 725",
  } as Record<string, string>,
};

/* ----------------------------------------------------------------- front */

const FRONT_HALF: Seg[] = [
  { c1: [740, 400], c2: [800, 402], to: [828, 412] },
  { c1: [846, 440], c2: [866, 480], to: [882, 500] },
  { c1: [920, 506], c2: [944, 522], to: [950, 548] },
  { c1: [956, 590], c2: [957, 640], to: [954, 680] },
  { c1: [953, 690], c2: [950, 697], to: [946, 700] },
  { to: [878, 702] },
  { c1: [874, 720], c2: [870, 738], to: [862, 748] },
  { c1: [800, 754], c2: [740, 754], to: [CX, 754] },
];

export const FRONT = {
  body: mirrored([CX, 400], FRONT_HALF),
  topLine: across([CX, 400], FRONT_HALF.slice(0, 3)),
  windshield: "M 568 416 C 640 411 730 411 802 416 L 862 486 C 770 492 600 492 508 486 Z",
  windshieldBox: [506, 410, 358, 82] as [number, number, number, number],
  /** Thin slivers of the door glass visible past the A-pillars. */
  sideGlassR: "M 814 416 C 834 440 852 470 868 496 L 880 498 C 864 478 846 440 828 412 Z",
  sideGlassBox: [812, 410, 70, 90] as [number, number, number, number],
  cowl: "M 508 486 C 600 492 770 492 862 486 L 866 496 C 770 502 600 502 504 496 Z",
  hood: "M 530 497 C 610 503 760 503 840 497 C 830 530 818 566 808 594 C 760 600 610 600 562 594 C 552 566 540 530 530 497 Z",
  hoodVent: "M 636 575 L 734 575 Q 742 575 742 580.5 Q 742 586 734 586 L 636 586 Q 628 586 628 580.5 Q 628 575 636 575 Z",
  nacaR: "M 736 546 L 744 546 L 750 524 L 730 524 Z",
  hoodCreaseR: "M 772 502 C 764 530 754 556 746 572",
  fenderCrestR: "M 846 500 C 872 510 894 526 904 550",
  louversR: [0, 1, 2, 3].map((i) => `M ${892 + i * 11} ${510 + i * 6} l 9 5`),
  headlightR: { cx: 878, cy: 574, rx: 50, ry: 36, rot: 16 },
  centerIntake:
    "M 590 652 L 780 652 C 790 652 796 658 794 668 L 786 710 C 784 718 776 722 768 722 L 602 722 C 594 722 586 718 584 710 L 576 668 C 574 658 580 652 590 652 Z",
  sideIntakeR: "M 818 638 C 850 632 902 632 936 640 C 940 662 936 690 926 708 L 826 712 C 818 690 814 662 818 638 Z",
  intakeSlatsR: "M 824 662 L 934 658 M 824 686 L 930 682",
  signalR: "M 822 630 C 852 624 902 624 934 632",
  lip: "M 450 738 C 560 744 810 744 920 738 L 924 750 C 810 758 560 758 446 750 Z",
  bumperLineR: "M 842 612 C 790 622 730 624 685 624",
  mirrorStalkR: "M 872 500 L 904 494 L 906 503 L 874 508 Z",
  mirrorCapR: "M 898 487 C 912 481 950 481 964 489 C 970 495 966 506 954 509 C 936 512 910 511 900 504 C 894 498 894 491 898 487 Z",
  wingPlane: "M 436 402 C 560 399 810 399 934 402 L 934 418 C 810 415 560 415 436 418 Z",
  wingEndplateR: "M 925 393 L 939 393 Q 942 393 942 396 L 942 425 Q 942 428 939 428 L 927 428 Q 924 428 924 425 L 924 396 Q 924 393 925 393 Z",
  tyreR: { x: 876, y: 690, w: 76, h: 88 },
  /** Centre of the hood, where the paint-correction loupe looks. */
  hoodSpot: [685, 540] as Point,
  /** Where colored film shows for each PPF coverage: the nose only, the whole front end, or everything. */
  ppf: {
    partial: "M 0 556 L 1400 556 L 1400 800 L 0 800 Z",
    "full-front": "M 0 488 L 1400 488 L 1400 800 L 0 800 Z",
    "full-body": "M 0 380 L 1400 380 L 1400 800 L 0 800 Z",
  } as Record<string, string>,
};

/* ------------------------------------------------------------------ rear */

const REAR_HALF: Seg[] = [
  { c1: [740, 398], c2: [798, 400], to: [822, 410] },
  { c1: [840, 430], c2: [856, 468], to: [866, 490] },
  { c1: [900, 500], c2: [932, 522], to: [944, 560] },
  { c1: [952, 580], c2: [957, 606], to: [956, 630] },
  { c1: [955, 660], c2: [953, 684], to: [950, 696] },
  { to: [862, 700] },
  { c1: [858, 716], c2: [856, 735], to: [852, 748] },
  { c1: [800, 752], c2: [740, 752], to: [CX, 752] },
];

export const REAR = {
  body: mirrored([CX, 398], REAR_HALF),
  topLine: across([CX, 398], REAR_HALF.slice(0, 3)),
  rearGlass: "M 582 414 C 640 410 730 410 788 414 L 822 468 C 760 474 610 474 548 468 Z",
  rearGlassBox: [546, 408, 278, 68] as [number, number, number, number],
  deckLid: "M 548 474 C 610 480 760 480 822 474 C 836 510 846 540 850 562 L 520 562 C 524 540 534 510 548 474 Z",
  grille: "M 596 500 L 774 500 Q 780 500 780 506 L 780 546 Q 780 552 774 552 L 596 552 Q 590 552 590 546 L 590 506 Q 590 500 596 500 Z",
  brakeLight: "M 650 494 L 720 494 L 720 498 L 650 498 Z",
  wingPlane: "M 432 468 C 560 462 810 462 938 468 L 938 488 C 810 484 560 484 432 488 Z",
  wingEndplateR: "M 928 452 L 942 452 Q 946 452 946 458 L 946 510 Q 946 516 940 516 L 930 516 Q 926 516 926 510 L 926 456 Q 926 452 928 452 Z",
  wingUprightR: "M 752 486 L 766 486 L 770 532 L 748 532 Z",
  tailLightR: "M 780 566 C 840 563 900 566 950 574 L 948 586 C 900 580 840 578 780 580 Q 774 573 780 566 Z",
  plate: "M 628 606 L 742 606 Q 750 606 750 614 L 750 650 Q 750 658 742 658 L 628 658 Q 620 658 620 650 L 620 614 Q 620 606 628 606 Z",
  exhaustSurround: "M 640 676 L 730 676 Q 742 676 742 688 L 742 700 Q 742 712 730 712 L 640 712 Q 628 712 628 700 L 628 688 Q 628 676 640 676 Z",
  exhausts: [[662, 694], [708, 694]] as Point[],
  diffuser: "M 500 718 L 870 718 L 862 750 L 508 750 Z",
  ventR: "M 872 612 L 940 604 C 944 630 944 660 940 684 L 876 690 C 872 664 870 636 872 612 Z",
  reflectorR: "M 800 668 L 856 664 L 856 670 L 800 674 Z",
  tyreR: { x: 858, y: 688, w: 92, h: 90 },
};

/** Mirror transform for drawing the left-hand copy of a right-hand detail. */
export const MIRROR = `matrix(-1 0 0 1 ${2 * CX} 0)`;
