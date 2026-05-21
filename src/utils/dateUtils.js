import { format, parseISO } from 'date-fns'

export function formatDateISO(iso){
  try{
    return format(parseISO(iso), 'dd MMM yyyy')
  }catch(e){
    return iso
  }
}
