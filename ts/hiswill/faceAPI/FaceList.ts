﻿/// <reference path="FaceAPI.ts" />

/// <reference path="FacePairArray.ts" />

/// <reference path="SimilarFaceArray.ts" />

namespace hiswill.faceapi
{
    /**
     * <p> A FacePairArray for representing a face list. </p>
     *
     * <p> References </p>
     * <ul>
     *  <li> Creating a FaceList: https://dev.projectoxford.ai/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039524b </li>
     *  <li> Find Similar: https://dev.projectoxford.ai/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237 </li>
     * </ul>
     *
     * @inheritDoc
     */
    export class FaceList
        extends FacePairArray
    {
        /**
         * An array and parent of the FaceList.
         */
        protected listArray: FaceListArray;

        /* --------------------------------------------------------
            CONTRUCTORS
        -------------------------------------------------------- */
        /**
         * Construct from a FaceListArray and name. 
         *
         * @param listArray An array and parent of the FaceList.
         * @param name Name representing the FaceList.
         */ 
        public constructor(listArray: FaceListArray, name: string = "")
        {
            super(name);

            this.listArray = listArray;

            this.id = "";
            this.name = name;

            this.registered = false;
        }

        /* --------------------------------------------------------
            INTERACTION WITH FACE API
        -------------------------------------------------------- */
        /**
         * Find similar faces in the FaceList from a Face.
         *
         * <ul>
         *  <li> Reference: https://dev.projectoxford.ai/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237 </li>
         * </ul>
         *
         * @param face A Face who wants find the similars.
         * @param maxCandidates Maximum number of candidates to be retured.
         *
         * @return Similar faces being looked similar.
         */
        public findSimilars(face: Face, maxCandidates: number): void
        {
            var this_ = this;
            var similarFaceArray: SimilarFaceArray = new SimilarFaceArray(face, this);

            FaceAPI.query
            (
                "https://api.projectoxford.ai/face/v1.0/findsimilars",
                "POST",

                {
                    "faceId": face.getID(), 
                    "faceListId": this.id, 
                    "maxNumOfCandidatesReturned": maxCandidates
                },
                null,

                function (data)
                {
                    similarFaceArray.constructByJSON(data);

                    this_.dispatchEvent(new FindSimilarEvent(this_, face, maxCandidates, similarFaceArray));
                }
            );
        }

        /**
         * Insert the FaceList to the Face-API server.
         *
         * <ul>
         *  <li> Reference: https://dev.projectoxford.ai/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039524b </li>
         * </ul>
         */
        public register(): void
        {
            // ISSUE ID
            if (this.id == "")
                this.id = FaceAPI.issueID("face_list");

            var this_: FaceList = this;

            // REGISTER TO THE SERVER
            var url: string = "https://api.projectoxford.ai/face/v1.0/facelists/" + this.id;
            var method: string = "PUT";
        
            var params: Object = {"faceListId": this.id};
            var data: Object = 
            {
                "name": this.name,
                "userData": ""
            };

            var success: Function = function(data)
            {
                this_.handleRegister(data);
            }

            // SEND
            FaceAPI.query(url, method, params, data, success);
        }

        /**
         * Remove the FaceList from the Face-API server.
         *
         * <ul>
         *  <li> Reference: https://dev.projectoxford.ai/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039524b </li>
         * </ul>
         */
        public unregister(): void
        {
            var this_ = this;

            // READY
            var url: string = "https://api.projectoxford.ai/face/v1.0/facelists/" + this.id;
            var method: string = "DELETE";
            var params: Object = { "faceListId": this.id };
        
            var func: Function = function(data)
            {
                this_.handleUnregister();
            }

            // SEND
            FaceAPI.query(url, method, params, null, func);
        }

        /**
         * Insert a child FacePair instance to the Face-API server
         *
         * <ul>
         *  <li> Reference: https://dev.projectoxford.ai/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395250 </li>
         * </ul>
         */
        public registerFace(face: FacePair): void
        {
            if (this.isRegistered() == false)
                this.register();

            FaceAPI.query
            (
                "https://api.projectoxford.ai/face/v1.0/facelists/" + this.id + "/persistedFaces",
                "POST",

                {
                    //"faceListId": this.id,
                    "userData": "",
                    "targetFace": face.getX() + "," + face.getY() + "," + face.getWidth() + "," + face.getHeight()
                },
                {
                    "url": face.getPictureURL()
                },

                function (data)
                {
                    face.setID( data["persistedFaceId"] );
                }
            );
        }

        /**
         * Remove a child FacePair instance from the Face-API server.
         *
         * <ul>
         *  <li> Reference: https://dev.projectoxford.ai/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395251 </li>
         * </ul>
         */
        public unregisterFace(face: FacePair): void
        {
            FaceAPI.query
            (
                "https://api.projectoxford.ai/face/v1.0/facelists/" + this.id + "/persistedFaces/" + face.getID(),
                "DELETE",

                {
                    "faceListId": this.id,
                    "persistedFaceId": face.getID()
                },
                null,

                null
            );

            super.unregisterFace(face);
        }
        
        /* --------------------------------------------------------
            GETTERS & SETTERS
        -------------------------------------------------------- */
        /**
         * Get api in listArray.
         */
        public getAPI(): FaceAPI
        {
            return this.listArray.getAPI();
        }

        /**
         * Get listArray.
         */
        public getListArray(): FaceListArray
        {
            return this.listArray;
        }

        /**
         * Set name and notify it to the Face-API server. 
         *
         * <ul>
         *  <li> Reference: https://dev.projectoxford.ai/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039524e </li>
         * </ul>
         *
         * @param name New name of the FacePairArray.
         */
        public setName(name: string): void
        {
            var this_ = this;

            FaceAPI.query
            (
                "https://api.projectoxford.ai/face/v1.0/facelists/" + this.id,
                "PATCH",

                { "faceListId": this.id },
                {
                    "name": this.name,
                    "userData": ""
                },

                function (data)
                {
                    this_.name = name;
                }
            );
        }

        /* --------------------------------------------------------
            EXPORTERS
        -------------------------------------------------------- */
        public TAG(): string
        {
            return "faceList";
        }
    }
}