import React from "react"
import "./styles.css"
import clsx from "clsx"
type Theme = "light" | "dark"
type TodoStatus = "active" | "completed"
interface Todo {
  id: number,
  text: string,
  status: TodoStatus,
  order: number,
}

function App() {
  const [theme, setTheme] = React.useState<Theme>("light")
  const [todo, setTodo] = React.useState<Todo[]>([])
  const [filter, setFilter] = React.useState<TodoStatus | "all">("all")
  const [filtered, setFiltered] = React.useState<Todo[]>([])
  const handleSaveOrComplete = (type: string, value: string, itemId?: number) => {
    if (type == "add") {
      if (!value) return
      const lastItem = todo[todo.length - 1]
      const maxId = lastItem?.id ?? 0
      const maxOrder = lastItem?.order ?? 0
      setTodo([...todo, { id: maxId + 1, text: value, order: maxOrder + 1, status: "active" }])
      return
    }
    if (itemId) {
      const updatedIndex = todo.findIndex(el => el.id == itemId)
      if (updatedIndex <= -1) return
      const updatedItem = { ...todo[updatedIndex], status: "completed" as TodoStatus }
      const newTodo = [...todo]
      newTodo[updatedIndex] = updatedItem
      setTodo(newTodo)
    }
  }
  const handleDelete = (itemId?: number) => {
    if (!itemId) return
    const deletedIndex = todo.findIndex(el => el.id == itemId)
    if (deletedIndex <= -1) return
    const newTodo = todo.filter(el => el.id != itemId)
    setTodo(newTodo)
  }
  React.useEffect(() => {
    if (filter == "all") {
      setFiltered([...todo])
      return
    }
    setFiltered(todo.filter(el => el.status == filter))
  }, [todo, filter])
  const handleCLearComplete = () => {
    setTodo(todo.filter(el => el.status != "completed"))
  }
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, order: number) => {
    e.preventDefault();
    const dragIndex = e.dataTransfer.getData("text/plain");
    let updatedItems = [...todo];
    const [draggedItem] = updatedItems.filter(el => el.order == dragIndex as unknown as number);
    updatedItems = updatedItems.filter(el => el.order != dragIndex as unknown as number)
    const dropIndex = updatedItems.findIndex(el => el.order == order)
    updatedItems.splice(dropIndex + 1, 0, draggedItem);
    setTodo(updatedItems);

  }
  return (
    <div className={clsx("w-full h-full min-h-[100vh] bg-fixed bg-contain bg-top bg-no-repeat bg-clip-border", {
      "bg-[#FAFAFA] bg-[url(./images/bg-desktop-light.jpg)] mb:bg-[url(./images/bg-mobile-light.jpg)]": theme == "light",
      "bg-[#171823] bg-[url(./images/bg-desktop-dark.jpg)] mb:bg-[url(./images/bg-mobile-dark.jpg)]": theme != "light"
    })}>
      <div className="w-1/2 mb:w-4/5 h-max mx-auto pt-20">
        <header className="flex justify-between items-center mb-10">
          <span className="font-bold text-[2.5rem] leading-4 uppercase text-white">todo</span>
          <i onClick={() => setTheme("dark")} className={clsx(" w-7 h-7 bg-white cursor-pointer", {
            "block": theme == "light",
            "hidden": theme != "light"
          })} style={{ mask: "url(./images/icon-moon.svg) center / cover no-repeat", WebkitMask: "url(./images/icon-moon.svg) center / cover no-repeat" }}></i>
          <i onClick={() => setTheme("light")} className={clsx(" w-7 h-7 bg-white cursor-pointer", {
            "block": theme != "light",
            "hidden": theme == "light"
          })} style={{ mask: "url(./images/icon-sun.svg) center / cover no-repeat", WebkitMask: "url(./images/icon-sun.svg) center /cover no-repeat" }}></i>
        </header>
        <TodoItem theme={theme} type="add" onSaveOrComplete={(type, value, itemId) => handleSaveOrComplete(type, value, itemId)} />

        <div className={clsx("flex items-center justify-center flex-col w-full mt-6 py-6 rounded-lg shadow-lg", {
          "bg-white": theme == "light",
          "bg-[#25273D]": theme != "light",
        })}>
          <div className="flex flex-col w-full items-center justify-center bg-inherit">
            {
              (filtered.length == 0) ?
                <p className={clsx("text-[2rem] mb:text-[.75rem] ", { "text-white": theme != "light", "text-[#C8CBE7]": theme == "light" })}>{filter == "all" ? "You clear all task, very nice!!!" : `You dont have ${filter} task now `}</p>
                :
                filtered.map((el: Todo) => <TodoItem onDelete={(itemId) => handleDelete(itemId)} theme={theme} item={el} key={el.id} type="input" onDrop={(e, order) => handleDrop(e, order)} onSaveOrComplete={(type, value, itemId) => handleSaveOrComplete(type, value, itemId)} />)
            }
          </div>

          <div className={clsx("flex px-6 py-2 w-full justify-between mb:justify-center items-center  text-[0.875rem] mb:text-[.75rem] tracking-[-0.2px] font-bold capitalize", {
            "text-[#5B5E7E]": theme != "light",
            "text-[#9495A5]": theme == "light"
          })}>
            <span className="flex gap-1 items-center mb:hidden"><span>{todo.length}</span>items left</span>
            <ul className="flex items-center justify-start  gap-5 ">
              <li onClick={() => setFilter("all")} className={filter == "all" ? "text-[#3A7CFD]" : ""}><a href="#">all</a></li>
              <li onClick={() => setFilter("active")} className={filter == "active" ? "text-[#3A7CFD]" : ""}><a href="#">active</a></li>
              <li onClick={() => setFilter("completed")} className={filter == "completed" ? "text-[#3A7CFD]" : ""}><a href="#">completed</a></li>
            </ul>
            <span onClick={() => handleCLearComplete()} className="cursor-pointer mb:hidden" >clear completed</span>
          </div>
        </div>
      </div>

    </div>

  )
}

export default App
export function TodoItem({ item, theme, type, onSaveOrComplete, onDelete, onDrop }: { item?: Todo, theme: Theme, type: string, onSaveOrComplete: (type: string, value: string, itemId?: number) => void, onDelete?: (itemId?: number) => void, onDrop?: (e: React.DragEvent<HTMLDivElement>, order: number) => void }): React.JSX.Element {
  const [inputValue, setValue] = React.useState<string>(item?.text ?? "")
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)
  const hanleDragStart = (e: React.DragEvent<HTMLDivElement>, order: number) => {
    e.dataTransfer.setData("text/plain", order as unknown as string)
  }
  return (
    <div draggable="true" onDragStart={(e) => hanleDragStart(e, item?.order ?? 0)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop?.(e, item?.order ?? 0)}
      className={clsx("flex items-center justify-start gap-6 rounded-md border-solid px-6 w-full select-none  todoItem", {
        "bg-white": theme == "light",
        "bg-[#25273D]": theme != "light",
        " border-[#E3E4F1] border-b-[1px]": theme == "light" && type != "add",
        " border-[#393A4B] border-b-[1px]": theme != "light" && type != "add",
      })}>
      <div onClick={() => onSaveOrComplete(type, inputValue, item?.id)} className={clsx("w-6 h-6 rounded-full relative border-solid border-[1px] cursor-pointer", {
        "bg-white border-[#E3E4F1]": item?.status != "completed",
        "bg-gradient-to-br from-[#55DDFF] to-[#C058F3] border-white": item?.status == "completed"
      })}> <i className="block w-2 h-2 bg-white absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]" style={{ mask: "url(./images/icon-checkk.svg) center / cover no-repeat", WebkitMask: "url(./images/icon-check.svg) center/ cover no-repeat" }}></i>
      </div>
      <input type="text" className={clsx(" cursor-pointer py-6 bg-inherit w-full outline-none", {
        "hidden": type != "add",
        "block": type == "item",
        "text-[#494C6B]": theme == "light",
        "text-[#C8CBE7]": theme != "light",
      })} value={inputValue} onChange={(e) => handleInput(e)} placeholder="Create a new todo..." />
      <span className={clsx("py-6 bg-inherit w-full text-[1.125rem] cursor-pointer", {
        "hidden": type == "add",
        "block": type == "item",
        "text-[#494C6B]": theme == "light",
        "text-[#C8CBE7]": theme != "light",
        "line-through text-opacity-50": item?.status == "completed"
      })}> {inputValue}</span>
      {
        (type != "add")
          ?
          <i onClick={() => onDelete?.(item?.id)} className={clsx("w-5 h-5 deleteIcon", {
            "bg-[#494C6B]": theme == "light",
            "bg-[#5B5E7E]": theme != "light"
          })} style={{ mask: "url(./images/icon-cross.svg) center / cover no-repeat", WebkitMask: "url(./images/icon-cross.svg) center /cover no-repeat" }}></i>
          : ""
      }
    </div>
  )
}