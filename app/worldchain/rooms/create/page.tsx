import RoomCreateForm from "@/components/RoomCreation";
import React from "react";

export default function CreateRoom() {
  return (
    <section className="flex flex-col items-center justify-center h-screen px-4 md:px-6">
      <RoomCreateForm />
    </section>
  );
}
