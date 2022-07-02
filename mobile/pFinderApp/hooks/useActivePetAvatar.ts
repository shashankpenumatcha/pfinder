import { useEffect } from "react";
import { getPetsAndAvatars, setActivePetAvatar } from "../shared/reducers/pet";
import { useAppDispatch, useAppSelector } from "../store";


export default function useActivePetAvatar() {
    const dispatch = useAppDispatch();
    const profile:any = useAppSelector(state => state.profile);
    const avatars:any = useAppSelector(state => state.pet.avatars);
    const activePetAvatar:any = useAppSelector(state => state.pet.activePetAvatar);
    useEffect(()=>{
        let activePetAvatar = null;
        if(profile?.activePet && avatars.length){
          activePetAvatar = avatars.filter((a:any)=>a?.pet?.id===profile?.activePet.id)[0]
        }
        dispatch(setActivePetAvatar(activePetAvatar));
    },[profile.activePet,avatars]);

    useEffect(()=>{
        dispatch(getPetsAndAvatars());
    },[])

    return activePetAvatar;
}