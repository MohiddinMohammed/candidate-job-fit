import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Gouse Mohiddin Mohammed — Product Owner · Technical Product Manager · AI & SaaS';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 72px',
        background: '#f7f8f5',
        color: '#18201b',
        fontFamily: 'Arial',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700, letterSpacing: '0.14em', color: '#718273' }}>
          <span>GOUSE MOHIDDIN MOHAMMED</span>
          <span>BERLIN · GERMANY</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 900 }}>
          <div style={{ fontSize: 58, fontWeight: 700, letterSpacing: '-0.04em' }}>Product Owner · Technical Product Manager</div>
          <div style={{ fontSize: 32, fontWeight: 500, color: '#718f78' }}>AI & SaaS · Product thinking + technical execution</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ width: 76, height: 76, borderRadius: 999, background: '#18201b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700 }}>P</div>
          <div style={{ display: 'flex', gap: 12, fontSize: 20, fontWeight: 600, color: '#526157' }}>
            <span style={{ padding: '12px 18px', border: '1px solid #d7dfd8', borderRadius: 999 }}>Problem</span>
            <span>→</span>
            <span style={{ padding: '12px 18px', border: '1px solid #d7dfd8', borderRadius: 999 }}>Data</span>
            <span>→</span>
            <span style={{ padding: '12px 18px', border: '1px solid #d7dfd8', borderRadius: 999 }}>Decision</span>
            <span>→</span>
            <span style={{ padding: '12px 18px', border: '1px solid #d7dfd8', borderRadius: 999 }}>Build</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
