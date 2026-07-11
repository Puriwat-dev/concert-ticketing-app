export default function AuthSidebar() {
  return (
    <div className="hidden w-1/2 flex-col justify-between bg-[#0070A4] p-28 text-white md:flex">
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-white"></div>
        <h1 className="ml-4 text-4xl font-semibold">Brand</h1>
      </div>

      <div>
        <div className="max-w-lg mb-8">
          <h1 className="font-semibold text-4xl">
            “Powering the tools that power the team.”
          </h1>
        </div>
        <p>
          Lorem ipsum dolor sit amet consectetur. Elit purus nam gravida
          porttitor nibh urna sit ornare a. Proin dolor morbi id ornare aenean
          non non
        </p>
      </div>
    </div>
  )
}
