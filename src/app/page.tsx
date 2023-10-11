import Image from 'next/image'

export default function Home() {
  return (
    <main className='p-5 grid grid-rows-2 grid-flow-col gap-2'>
      <div className='border-4 border-u1-red'>
        <div>Taborstraße</div>
        <div>
          <div>U1 Taborstraße</div>
          <div>2 Taborstraße</div>
        </div>
      </div>
      <div className='border-4 border-u2-purple'>
        <div>U2</div>
      </div>
      <div className='border-4 border-u4-green'>
        <div>U4</div>
      </div>
    </main>
  )
}
