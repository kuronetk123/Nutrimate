import clsx from 'clsx'

function Office({ name, children, invert = false }) {
  return (
    <address
      className={clsx(
        'text-sm not-italic',
        invert ? 'text-neutral-300' : 'text-neutral-600',
      )}
    >
      <strong className={invert ? 'text-white' : 'text-neutral-950'}>
        {name}
      </strong>
      <br />
      {children}
    </address>
  )
}

export function Offices({ invert = false, ...props }) {
  return (
    <ul role="list" {...props}>
      <li>
        <Office name="Copenhagen" invert={invert}>
          FPT University
          <br />
          Hoa Hai, Da Nang
        </Office>
      </li>
      <li>
        <Office name="Billund" invert={invert}>
          Le Duan
          <br />
          Da Nang
        </Office>
      </li>
    </ul>
  )
}
