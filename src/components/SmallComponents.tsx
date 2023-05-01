import { type FC } from "react"
type BackGroundprops ={
    children:JSX.Element[]
}
export const BackGround:FC<BackGroundprops> = ({children})=>{
    return (
        <div className="bg-gradient-to-b from-[#6d0214] to-[#2c1519] flex h-screen w-screen items-center justify-center overflow-auto">
            {...children}
        </div>
    )
}
