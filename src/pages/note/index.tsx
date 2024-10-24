import CardNote from "@components/card-note/card-note.component";
import ModalComponent from "@components/modal/confirm/modal-confirm.component";
import {
  NoteProps,
  TypeProps,
} from "@components/ui/texfield/textfield.component";
import { useToast } from "@hooks/useToast";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import classNames from "classnames";
import { capitalize, debounce } from "lodash-es";
import React, { useEffect, useRef, useState } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Button, Divider, Input } from "rsuite";
import style from "./style.module.less";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const modalRef = useRef<React.ElementRef<typeof ModalComponent>>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState<string>("");
  const [activeType, setActiveType] = useState<string>("");

  // Get Notes
  const {
    data: notes,
    isPending: pendingNote,
    isSuccess: successNote,
    refetch: refetchNotes,
  } = useQuery({
    queryKey: ["notes", search, activeType],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:3000/notes?search=${search}${activeType ? "&type=" + activeType : ""}`
      );

      return data.data;
    },
  });

  // Get Types
  const { data: types, refetch: refetchTypes } = useQuery({
    queryKey: ["types"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:3000/types");

      return data.data;
    },
  });

  const { mutate, isPending: deletePending } = useMutation({
    mutationFn: (data) => {
      return axios.delete(`http://localhost:3000/notes/${data}`);
    },
    onSuccess: () => {
      toast.show("success", "Note deleted successfully");
      refetchNotes();
    },
    onError: (error) => {
      toast.show("error", error.message);
    },
  });

  const onFilter = (val: string) => {
    val ? searchParams.set("search", val) : searchParams.delete("search");
    setSearchParams(searchParams, { replace: true });
  };

  const debouncedSearch = useRef(
    debounce((query) => {
      if (query.length >= 3 || query !== null || query !== "") {
        setSearch(query);
      }
    }, 300)
  ).current;

  useEffect(() => {
    // refetch after created note
    if (location.state === "created" || location.state === "updated") {
      refetchNotes();
      refetchTypes();
    }
  }, [location]);

  useEffect(() => {
    onFilter(search);
  }, [search]);

  return (
    <>
      <div className="w-full h-full pb-5">
        {/* Nav */}
        <div className="flex items-center gap-1 py-3 px-5 lg:px-54 bg-white shadow sticky top-0 z-1">
          <Input
            placeholder="Search note"
            className="flex-1"
            onChange={(value) => debouncedSearch(value)}
          />
          <Divider vertical />
          <Button
            appearance="primary"
            onClick={() => navigate("create", { state: "" })}
          >
            Create
          </Button>
        </div>
        {/* Body */}
        <div className="px-5 lg:px-54 my-5">
          <div className="">
            <h3 className=" text-black">Note App</h3>
            <div className={style.menu}>
              {successNote && (
                <>
                  <div
                    className={classNames(style.item, {
                      [style.active]: activeType === "",
                    })}
                    onClick={() => setActiveType("")}
                  >
                    All
                  </div>
                  {types?.map((type: TypeProps) => {
                    return (
                      <div
                        key={type.id}
                        className={classNames(style.item, {
                          [style.active]: type.name === activeType,
                        })}
                        onClick={() => setActiveType(type.name)}
                      >
                        {capitalize(type.name)}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
            {/* {successNote && <SplitButton types={types} />} */}
          </div>
          {pendingNote && <div>Loading...</div>}

          {successNote &&
            (notes.length === 0 ? (
              <div className="w-full h-500px flex flex-col justify-center items-center gap-3">
                <img
                  src="images/not-found.svg"
                  className="w-40"
                  alt="not-found"
                />
                <p>No Data Found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                {notes.map((note: NoteProps, index: number) => {
                  return (
                    <CardNote
                      key={index}
                      title={note.title}
                      content={note.content}
                      types={note.types}
                      date={new Date(note.createdAt || "").toDateString()}
                      onEdit={() =>
                        navigate(`${note.id}/update`, { state: "" })
                      }
                      onDetail={() => navigate(`${note.id}`)}
                      onDelete={() =>
                        modalRef.current?.open({
                          id: note.id || 0,
                          message: `Are you sure to delete this note ${note.title} ?`,
                        })
                      }
                    />
                  );
                })}
              </div>
            ))}
        </div>
      </div>
      <ModalComponent
        ref={modalRef}
        loading={deletePending}
        callback={(id: number) => mutate(id as any)}
      />
      <Outlet />
    </>
  );
};

export default HomePage;
