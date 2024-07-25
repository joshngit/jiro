import { ButtonLink } from '../../../components/ui/ButtonLink'
import { paths } from '../../../routes/paths'

export function Actions() {
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-2 gap-4 w-full max-w-96">
        <ButtonLink to={paths.deposit.url}>入金</ButtonLink>
        <ButtonLink to={paths.withdraw.url}>出金</ButtonLink>
        <ButtonLink to={paths.transfer.url}>振込</ButtonLink>
        <ButtonLink to={paths.recurringOrder.url}>口座振替</ButtonLink>
      </div>
    </div>
  )
}
