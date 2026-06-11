import Image from "next/image";
import { PlaceholderComponent } from "./placeholder.component";

export function HeaderComponent() {
    return (
        <section className="flex m-5 justify-between items-center">
            <Image
                src="/assets/svgs/logo.svg"
                width={90}
                height={31}
                alt="logo_img"
                priority
                className="object-contain"
                style={{ width: "auto", height: "auto" }}
            />
            <PlaceholderComponent />
        </section>
    )
}