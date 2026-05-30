const MOJIBAKE_RE = /(?:\u0420[\u0080-\u04ff]|\u0421[\u0080-\u04ff])/;

export function getDisplayDoctorName(source: any, fallback = 'Врач не указан') {
 const candidates = [
 source?.doctorName,
 source?.doctor?.fullName,
 source?.doctor?.name,
 source?.doctorInfo?.fullName,
 source?.doctorInfo?.name,
 source?.doctorId?.fullName,
 source?.doctorId?.name,
 ];

 const name = candidates.find((value) => {
 const text = String(value || '').trim();
 return text && text !== 'Врач' && text !== 'Врач не указан' && !MOJIBAKE_RE.test(text);
 });

 return name ? String(name).trim() : fallback;
}
