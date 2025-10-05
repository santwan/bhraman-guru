// Helpers that wrap sessionStorage and JSON stringify/pasrse with graceful failure handling 


const KEY = 'latest_trip_plan'

export function safeStringify( obj ) {
  try {
    return JSON.stringify( obj )
  } catch(err){
    console.warn("SafeStringify Failed: ", err);
    return null;
  }
}

export function persistPlanToSession( plan ) {
  const s = safeStringify( plan )
  if( s == null ) return false
  try {
    sessionStorage.setItem( KEY, s )
    return true
  } catch ( err ) {
    console.warn( " persistPlanToSession Failed : " , err )
    return false
  }
}

export function getPlanFromSession(){
  try {
    const raw = sessionStorage.getItem( KEY )
    if( !raw ) return null
    return JSON.parse(raw)
  } catch ( err ) {
    console.warn('getPlanFromSession parse error: ' , err )
    return null
  }
}