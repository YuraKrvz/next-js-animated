'use client'

import { LiAnimated } from '@/components/LiAnimated'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence } from 'framer-motion'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const Page = () => {
  const searchParams = useSearchParams()
  const name = searchParams.get('name') ?? ''

  const router = useRouter()
  const pathname = usePathname()
  const { data, isPlaceholderData, isLoading } = useQuery({
    queryKey: ['users', name],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3000/api/users?filter[name]=${name}`)
      const data = await res.json()

      return data
    },
    placeholderData: (previousData) => previousData,
  })

  return (
    <main className='flex min-h-screen items-center justify-center bg-zinc-300'>
      <div className='h-[400px] w-full max-w-lg'>
        <div className='bg-white rounded-xl'>
          <div className='flex justify-between w-full border-b-zinc-100 border-b-[1px] p-4 '>
            <input
              value={name}
              onChange={(e) => {
                const name = e.target.value

                if (name) {
                  router.push(`${pathname}?name=${name}`)
                } else {
                  router.push(pathname)
                }
              }}
              placeholder='Search by name...'
              className='focus-visible:outline-none text-zinc-600'
            />
          </div>
          <div className='overflow-y-scroll px-3 py-2 min-h-[75px] max-h-[400px]'>
            <ul style={{ filter: isPlaceholderData ? 'blur(0.7px)' : 'none' }}>
              <AnimatePresence initial={false}>
                {data?.length === 0 && (
                  <LiAnimated>
                    <h1 className='text-center font-semibold py-4 text-zinc-400'>Nothing found.</h1>
                  </LiAnimated>
                )}
                {isLoading && (
                  <LiAnimated>
                    <h1 className='text-center font-semibold py-4 text-zinc-400'>Loading...</h1>
                  </LiAnimated>
                )}
                {data?.map((message: any, index: number) => (
                  <LiAnimated key={message?.id}>
                    <div className='py-0.5 transition'>
                      <div
                        className={`flex flex-col w-full p-4 rounded-md transition-colors ${
                          index % 2 === 1 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <p className={`font-medium transition-colors text-zinc-600`}>
                          {message.name}
                        </p>
                        <span className={`text-sm transition-colors text-zinc-400`}>
                          {message.username}
                        </span>
                      </div>
                    </div>
                  </LiAnimated>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Page
