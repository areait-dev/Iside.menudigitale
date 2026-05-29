import { getStaffDipendenteMenu } from '@/lib/supabase/menu'

export const dynamic = 'force-dynamic'

export default async function StaffMenuDipendentePage() {
  const menuByDay = await getStaffDipendenteMenu()
  const hasItems = menuByDay.length > 0

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-slate-700">
              AREA STAFF
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              MENU DIPENDENTE
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Questa pagina è riservata al personale e accessibile solo tramite URL diretto.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <table className="min-w-full text-left">
              <thead className="border-b border-slate-200 bg-slate-100">
                <tr>
                  <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Giorno
                  </th>
                  <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Piatti
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {hasItems ? (
                  menuByDay.map((day) => (
                    <tr key={day.day} className="hover:bg-slate-50">
                      <td className="whitespace-nowrap px-4 py-5 align-top text-sm font-semibold text-slate-900">
                        {day.day}
                      </td>
                      <td className="px-4 py-5">
                        <div className="space-y-3">
                          {day.items.map((item) => (
                            <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                                <span className="text-xs uppercase tracking-[0.24em] text-slate-500">
                                  {item.category}
                                </span>
                              </div>
                              {item.description ? (
                                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="px-4 py-10 text-center text-sm text-slate-500">
                      Nessun menu dipendente disponibile al momento.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  )
}
