import Head from "next/head";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";

export default function Home() {
  interface Task {
    uid: string;
    task: string;
    completed: boolean;
  }

  const secretKey =
    "8a3baa130c33728c3e7b9a8d110c7b795a91d54746c2f6199b7ed4d597a6f2df";

  const [darkMode, setDarkMode] = useState(false);
  const [todoList, setTodoList] = useState<Task[]>([]);
  const [animation, setAnimation] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);
  const [filter, setFilter] = useState(1);

  const mounted = useRef(false);

  useEffect(() => {
    setAnimation(true);
    const savedMode = Cookies.get("darkMode");
    if (savedMode) {
      setDarkMode(
        CryptoJS.AES.decrypt(savedMode, secretKey).toString(
          CryptoJS.enc.Utf8
        ) === "true"
      );
    }

    if (typeof window !== "undefined") {
      setIsBrowser(true);
    }
  }, []);

  useEffect(() => {
    if (mounted.current) {
      Cookies.set(
        "darkMode",
        CryptoJS.AES.encrypt(darkMode.toString(), secretKey).toString(),
        {
          expires: 365,
          SameSite: "None",
          secure: true,
        }
      );
    } else {
      mounted.current = true;
    }
  }, [darkMode]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const inputElement = e.target as HTMLInputElement;
      const uid = uuidv4();
      const task: Task = {
        uid: uid,
        task: inputElement.value,
        completed: false,
      };
      setTodoList([task, ...todoList]);
    }
  };

  const handleComplete = (uid: string) => {
    setTodoList(
      todoList.map((task) => {
        if (task.uid === uid) {
          if (task.completed === false) return { ...task, completed: true };
          if (task.completed === true) return { ...task, completed: false };
        }
        return task;
      })
    );
  };

  const handleDelete = (uid: string) => {
    setTodoList(todoList.filter((task) => task.uid !== uid));
  };

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;
    const items = Array.from(todoList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTodoList(items);
  }

  return (
    <>
      <Head>
        <title>Frontend Mentor | Todo app</title>
        <meta name="description" content="Made by Loai Esam" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon-32x32.png" />
      </Head>
      <main
        className={`${styles.main} ${darkMode && styles.darkMode} ${
          animation && styles.visible
        }`}
      >
        <div className={styles.todoApp}>
          <header className={styles.header}>
            <h1>todo</h1>
            <div
              onClick={() => {
                setDarkMode(!darkMode);
              }}
            >
              <Image
                src={darkMode ? "/icon-sun.svg" : "/icon-moon.svg"}
                alt={"moon icon"}
                width={25}
                height={25}
              />
            </div>
          </header>
          <div
            className={styles.createTask}
            onClick={() => inputRef.current && inputRef.current.focus()}
          >
            <input
              type="text"
              placeholder="Create a new todo..."
              onKeyDown={handleKeyPress}
              onChange={(e) => {
                if (e.target.value.length > 32)
                  e.target.value = e.target.value.slice(0, 32);
              }}
            />
          </div>

          <div className={styles.tasks}>
            <DragDropContext onDragEnd={handleDragEnd}>
              {isBrowser ? (
                <Droppable droppableId="tasks">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={styles.droppable}
                    >
                      {todoList
                        .filter((task) => {
                          if (filter === 1) return true;
                          if (filter === 2) return task.completed === false;
                          if (filter === 3) return task.completed === true;
                        })
                        .map(({ task, uid, completed }, index) => (
                          <Draggable key={uid} draggableId={uid} index={index}>
                            {(provided) => (
                              <div
                                className={styles.task}
                                {...provided.dragHandleProps}
                                {...provided.draggableProps}
                                ref={provided.innerRef}
                              >
                                <span
                                  onClick={() => handleComplete(uid)}
                                  className={
                                    completed ? styles.completed : undefined
                                  }
                                ></span>
                                <span>{task}</span>
                                <span onClick={() => handleDelete(uid)}></span>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ) : null}
            </DragDropContext>
            <div className={styles.toolbar}>
              <span className={styles.firstButton}>
                {todoList.filter((task) => task.completed === false).length}{" "}
                items left
              </span>
              <div>
                <span
                  onClick={() => setFilter(1)}
                  className={filter === 1 ? styles.activeFilter : undefined}
                >
                  All
                </span>
                <span
                  onClick={() => setFilter(2)}
                  className={filter === 2 ? styles.activeFilter : undefined}
                >
                  Active
                </span>
                <span
                  onClick={() => setFilter(3)}
                  className={filter === 3 ? styles.activeFilter : undefined}
                >
                  Completed
                </span>
              </div>
              <span
                className={styles.lastButton}
                onClick={() => {
                  setTodoList(
                    todoList.filter((task) => task.completed === false)
                  );
                }}
              >
                Clear Completed
              </span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
