import MenuPageLayout from '@/components/menu/MenuPageLayout'
import AllergeniGrid from '@/components/menu/AllergeniGrid'

export default function AllergeniPage() {
  return (
    <MenuPageLayout title="Allergeni">
      <p className="text-center text-sm sm:text-base text-gray-600 max-w-2xl mx-auto mb-8 sm:mb-10">
        Gli allergeni indicati sono quelli previsti dal Regolamento UE 1169/2011.
        Per qualsiasi dubbio o intolleranza, chiedi pure al nostro staff.
      </p>
      <AllergeniGrid />
    </MenuPageLayout>
  )
}
