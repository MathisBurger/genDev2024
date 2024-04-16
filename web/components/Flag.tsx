import Image from "next/image";


export enum FlagEnum {
    Germany="Deutschland",
    Belgium="Belgien",
    France="Frankreich",
    Portugal="Portugal",
    Scotland="Schottland",
    Spain="Spanien",
    Turkey="Türkei",
    Austria="Österreich",
    England="England",
    Hungary="Ungarn",
    Slovakia="Slovakei",
    Albania="Albanien",
    Denmark="Dänemark",
    Netherlands="Niederlande",
    Romania="Rumänien",
    Switzerland="Schweiz",
    Serbia="Serbien",
    CzechRepublic="Tschechische Republik",
    Italy="Italien",
    Slovenia="Slowenien",
    Croatia="Kroatien",
    Georgia="Georgien",
    Ukraine="Ukraine",
    Poland="Polen"
}

interface FlagProps {
    flag: FlagEnum;
    multi?: number;
    margin?: string;
}

const Flag = ({flag, multi, margin}: FlagProps) => {

    const multiplier = multi ?? 2;
    const marginLeft = margin ?? '7px';
    const marginRight = margin ?? '7px';

    switch (flag) {
        case FlagEnum.Germany:
            return <Image src="flags/Flag_of_Germany.svg.webp" alt="Germany" width={23*multiplier} height={15*multiplier} style={{marginRight, marginLeft}} />
        case FlagEnum.Belgium:
            return <Image src="flags/Flag_of_Belgium_(civil).svg.webp" alt="" width={23*multiplier} height={15*multiplier} style={{marginRight, marginLeft}} />
        case FlagEnum.France:
            return <Image src="flags/Flag_of_France.svg.webp" alt="" width={23*multiplier} height={15*multiplier} style={{marginRight, marginLeft}} />
        case FlagEnum.Portugal:
            return <Image src="flags/Flag_of_Portugal.svg.webp" alt="" width={23*multiplier} height={15*multiplier} style={{marginRight, marginLeft}} />
        case FlagEnum.Scotland:
            return <Image src="flags/Flag_of_Scotland.svg.webp" alt="" width={23*multiplier} height={15*multiplier} style={{marginRight, marginLeft}} />
        case FlagEnum.Spain:
            return <Image src="flags/Flag_of_Spain.svg.webp" alt="" width={23*multiplier} height={15*multiplier} style={{marginRight, marginLeft}} />
        case FlagEnum.Turkey:
            return <Image src="flags/Flag_of_Turkey.svg.webp" alt="" width={23*multiplier} height={15*multiplier} style={{marginRight, marginLeft}} />
        case FlagEnum.Austria:
            return <Image src="flags/Flag_of_Austria.svg.webp" alt="" width={23*multiplier} height={15*multiplier} style={{marginRight, marginLeft}} />
        case FlagEnum.England:
            return <Image src="flags/Flag_of_England.svg.webp" alt="" width={23*multiplier} height={15*multiplier} style={{marginRight, marginLeft}} />
        case FlagEnum.Hungary:
            return <Image src="flags/Flag_of_Hungary.svg.webp" alt="" width={23*multiplier} height={15*multiplier} style={{marginRight, marginLeft}} />
        case FlagEnum.Slovakia:
            return <Image src="flags/Flag_of_Slovakia.svg.webp" alt="" width={23*multiplier} height={15*multiplier} style={{marginRight, marginLeft}} />
        case FlagEnum.Albania:
            return <Image src="flags/Flag_of_Albania.svg.webp" alt="" width={23*multiplier} height={15*multiplier} style={{marginRight, marginLeft}} />
        case FlagEnum.Denmark:
            return <Image src="flags/Flag_of_Denmark.svg.webp" alt="" width={23*multiplier} height={15*multiplier} style={{marginRight, marginLeft}} />
        case FlagEnum.Netherlands:
            return <Image src="flags/Flag_of_the_Netherlands.svg.webp" alt="" width={23*multiplier} height={15*multiplier} style={{marginRight, marginLeft}} />
        case FlagEnum.Romania:
            return <Image src="flags/Flag_of_Romania.svg.webp" alt="" width={23*multiplier} height={15*multiplier} style={{marginRight, marginLeft}} />
        case FlagEnum.Switzerland:
            return <Image src="flags/Flag_of_Switzerland_(Pantone).svg.webp" alt="" width={16*multiplier} height={16*multiplier} style={{marginRight, marginLeft}} />
        case FlagEnum.Serbia:
            return <Image src="flags/Flag_of_Serbia.svg.webp" alt="" width={23*multiplier} height={15*multiplier} style={{marginRight, marginLeft}} />
        case FlagEnum.CzechRepublic:
            return <Image src="flags/Flag_of_the_Czech_Republic.svg.webp" alt="" width={23*multiplier} height={15*multiplier} style={{marginRight, marginLeft}} />
        case FlagEnum.Italy:
            return <Image src="flags/Flag_of_Italy.svg.webp" alt="" width={23*multiplier} height={15*multiplier} style={{marginRight, marginLeft}} />
        case FlagEnum.Slovenia:
            return <Image src="flags/Flag_of_Slovakia.svg.webp" alt="" width={23*multiplier} height={15*multiplier} style={{marginRight, marginLeft}} />
        case FlagEnum.Croatia:
            return <Image src="flags/Flag_of_Croatia.svg.webp" alt="" width={23*multiplier} height={15*multiplier} style={{marginRight, marginLeft}} />
        case FlagEnum.Georgia:
            return <Image src="flags/Flag_of_Georgia.svg.webp" alt="" width={23*multiplier} height={15*multiplier} style={{marginRight, marginLeft}} />
        case FlagEnum.Ukraine:
            return <Image src="flags/Flag_of_Ukraine.svg.webp" alt="" width={23*multiplier} height={15*multiplier} style={{marginRight, marginLeft}} />
        case FlagEnum.Poland:
            return <Image src="flags/Flag_of_Poland.svg.webp" alt="" width={23*multiplier} height={15*multiplier} style={{marginRight, marginLeft}} />
    }
    return null;
}

export default Flag;