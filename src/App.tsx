import Timer from "./features/timer/Timer"
import RacetimeForm from "./features/racetimeForm/RacetimeForm"
import Usb2SnesSettings from "./features/usb2snes/Usb2SnesSettings"

function App() {
  return (
    <>
      <RacetimeForm />
      <div>
        <Timer />
      </div>
      <div className="pt-8 text-3xl">USB2SNES Settings</div>
      <Usb2SnesSettings />
    </>
  )
}

export default App
