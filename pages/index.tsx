import Head from "next/head";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import styles from "@/styles/Home.module.css";

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

  useEffect(() => {
    const savedMode = Cookies.get("darkMode");
    if (savedMode) {
      setDarkMode(
        Boolean(
          CryptoJS.AES.decrypt(savedMode, secretKey).toString(CryptoJS.enc.Utf8)
        )
      );
    }
  }, []);

  useEffect(() => {
    Cookies.set(
      "darkMode",
      CryptoJS.AES.encrypt(darkMode.toString(), secretKey).toString()
    );
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
    let newTodoList = todoList;
    newTodoList = newTodoList.map((task) => {
      if (task.uid === uid) {
        return { ...task, completed: true };
      }
      return task;
    });
    setTodoList(newTodoList);
  };

  const handleDelete = (uid: string) => {
    let newTodoList = todoList;
    newTodoList = newTodoList.filter((task) => {
      if (task.uid === uid) {
        return false;
      }
      return true;
    });
    setTodoList(newTodoList);
  };

  return (
    <>
      <Head>
        <title>Frontend Mentor | Todo app</title>
        <meta name="description" content="Made by Loai Esam" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon-32x32.png" />
      </Head>
      <main className={`${styles.main} ${darkMode && styles.darkMode}`}>
        <div className={styles.todoApp}>
          <div>
            <h1>todo</h1>
            <div onClick={() => setDarkMode(!darkMode)}>
              <Image
                src={darkMode ? "/icon-sun.svg" : "/icon-moon.svg"}
                alt={"moon icon"}
                width={25}
                height={25}
              />
            </div>
          </div>
          <div>
            <input
              type="text"
              placeholder="Create a new todo..."
              onKeyDown={handleKeyPress}
            />
          </div>
          <div className={styles.tasks}>
            {todoList.map((e) => {
              return (
                <div key={e.uid}>
                  <div onClick={() => handleComplete(e.uid)}></div>
                  <span>{e.task}</span>
                  <div onClick={() => handleDelete(e.uid)}></div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
