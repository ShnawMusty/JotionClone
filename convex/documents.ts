import {v} from 'convex/values'
import {mutation, query} from './_generated/server'
import { Doc, Id } from './_generated/dataModel'

export const create = mutation({
  args: {
      title: v.string(),
      parentDocument: v.optional(v.id("documents"))
  },
  handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();

      if (!identity) throw new Error ("Not authenticated")

      const userId = identity.subject

      const document = await ctx.db.insert('documents', {
          title: args.title,
          parentDocument: args.parentDocument,
          userId,
          isArchived: false,
          isPublished: false,
      })

      return document;
      
  }
})

export const getSidebar = query({
    args: {
        parentDocument: v.optional(v.id('documents'))
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) throw new Error ("Not authenticated")

        const userId = identity.subject

        const documents = await ctx.db.query("documents").withIndex("by_user_parent", (q) =>  q
        .eq("userId", userId)
        .eq("parentDocument", args.parentDocument)
        )
        .filter((q) => q.eq(q.field("isArchived"), false))
        .order('desc')
        .collect()

        return documents
    }
});

export const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated')
    }
    const userId = identity.subject;

    const documents = await ctx.db
    .query('documents')
    .withIndex('by_user', (q) => q.eq('userId', userId))
    .filter((q) => q.eq(q.field('isArchived'), false))
    .order('desc')
    .collect();

    return documents;
  }
})

export const getById = query({
  args: { documentId: v.id('documents')},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const userId = identity?.subject;

    const document = await ctx.db
    .get(args.documentId);

    if (!document) {
      throw new Error('Not found')
    }

    if (document.userId === userId) {
      return document
    }

    if (!document?.isPublished && document?.userId !== userId) {
      throw new Error('Unauthorized')
    }

    if (document?.isPublished && !document?.isArchived) {
      return document
    }

  },
})

export const update = mutation({
  args: {
    id: v.id('documents'),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    icon: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    isPublished: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthenticated')
    }

    const userId = identity.subject;

    const { id, ...rest} = args;

    const existingDocument = await ctx.db.get(id);

    if (!existingDocument) {
      throw new Error('Not found')
    };

    if (existingDocument.userId !== userId) {
      throw new Error('Unauthorized')
    };

    const patchedDocument = await ctx.db.patch(id, {...rest})

    return patchedDocument
  },
})

export const archive = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error ("Not authenticated")

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id)

    if (!existingDocument) {
      throw new Error('Document not found')
    }

    if (existingDocument.userId !== userId) {
      throw new Error('Unauthorized')
    };

    const recursiveArchive = async (documentId: Id<'documents'>) => {
      const childDocuments = await ctx.db
      .query('documents')
      .withIndex('by_user_parent', (q) => q.eq('userId', userId).eq('parentDocument', documentId) ).collect();

      for (let child of childDocuments) {
        await ctx.db.patch(child._id, {
          isArchived: true
        })

        await recursiveArchive(child._id)
      }

    }

    const document = await ctx.db.patch(args.id, {
      isArchived: true
    });

    await recursiveArchive(args.id)

    return document

  }
})

export const getTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error ("Not authenticated");

    const userId = identity.subject;

    const documents = await ctx.db.query('documents')
    .withIndex('by_user', (q) => q.eq('userId', userId))
    .filter((q) => q.eq(q.field('isArchived'), true))
    .order('desc')
    .collect();

    return documents;
  }
})

export const restore = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error ("Not authenticated");

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id)

    if (!existingDocument) {
      throw new Error('Document not found')
    }

    if (existingDocument.userId !== userId) {
      throw new Error('Unauthorized')
    };

    const recursiveDeArchiveParents = async (existingDocument: Doc<'documents'>) => {
      if (existingDocument.parentDocument) {
        const parent = await ctx.db.get(existingDocument?.parentDocument)
        if (parent?.isArchived) {
          await ctx.db.patch(parent?._id, {
            isArchived: false
          })
          await recursiveDeArchiveParents(parent)
        }
      }
    }

    const recursiveDeArchiveChilds = async (documentId: Id<'documents'>) => {
      const childDocuments = await ctx.db
      .query('documents')
      .withIndex('by_user_parent', (q) => q.eq('userId', userId).eq('parentDocument', documentId) ).collect();

      for (let child of childDocuments) {
        await ctx.db.patch(child._id, {
          isArchived: false
        })

        await recursiveDeArchiveChilds(child._id)
      }

    }

    const document = await ctx.db.patch(args.id, {
      isArchived: false
    });

    await recursiveDeArchiveParents(existingDocument)
    await recursiveDeArchiveChilds(args.id);

    return document;
  }
})

export const remove = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error ("Not authenticated");

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id)

    if (!existingDocument) {
      throw new Error('Document not found')
    }

    if (existingDocument.userId !== userId) {
      throw new Error('Unauthorized')
    };

    const document = await ctx.db.delete(args.id);
    return document
  },
})

export const removeIcon = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error ("Not authenticated");

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id)

    if (!existingDocument) {
      throw new Error('Document not found')
    }

    if (existingDocument.userId !== userId) {
      throw new Error('Unauthorized')
    };

    const document = await ctx.db.patch(args.id, {
      icon: undefined
    });

    return document;
  }
})

export const generateUploadUrl = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error ("Not authenticated");

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id)

    if (!existingDocument) {
      throw new Error('Document not found')
    }

    if (existingDocument.userId !== userId) {
      throw new Error('Unauthorized')
    };

    return await ctx.storage.generateUploadUrl();
  }
})

export const getImageUrl = query({
  args: {storageId: v.id('_storage')},
  handler: async (ctx, args) => {
    const imageUrl = await ctx.storage.getUrl(args.storageId)

    return imageUrl;
  }
})

export const getCoverImageUrl = query({
  args: {id: v.id('documents')},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error ("Not authenticated");

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id)

    if (!existingDocument) {
      throw new Error('Document not found')
    }

    if (existingDocument.userId !== userId) {
      throw new Error('Unauthorized')
    };

    if (!existingDocument.coverImage) {
      return
    }

    const coverImageUrl = await ctx.storage.getUrl(existingDocument.coverImage as Id<"_storage">)

    return coverImageUrl;
  }
})

export const deleteCoverById = mutation({
  args: { documentId: v.id('documents')},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error ("Not authenticated");

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.documentId);

    if (!existingDocument) {
      throw new Error('Document not found')
    };

    if (existingDocument.userId !== userId) {
      throw new Error('Unauthorized')
    };

    await ctx.db.patch(args.documentId, {
      coverImage: undefined
    });

    return existingDocument;
  }
})




