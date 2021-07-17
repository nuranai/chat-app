export function PasswordTooltip() {
  return (
    <div className="tooltip__text">
      <span>Password Must:<br />
        * be longer than 7 characters<br />
        * contain at least one number<br />
        * contain at least one upper and lower case letters</span>
    </div>
  )
}

export function UserTooltip() {
  return (
      <div className="tooltip__text">
          <span>Username must be between 4 and 32 characters<br />
          Username may contain _, -, .
          </span>
      </div>
  )
}