import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_SETTINGS } from "@/types/blocks";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { templateId } = await request.json();

    const { data: template, error: templateError } = await supabase
      .from("templates")
      .select("*")
      .eq("id", templateId)
      .single();

    if (templateError || !template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    // Use template blocks and settings, assign new IDs to blocks
    const blocks = Array.isArray(template.blocks)
      ? template.blocks.map((b: Record<string, unknown>) => ({
          ...b,
          id: crypto.randomUUID(),
        }))
      : [];

    const settings = {
      ...DEFAULT_SETTINGS,
      ...(typeof template.settings === "object" && template.settings !== null
        ? template.settings
        : {}),
    };

    const slugBase = template.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const slug = `${slugBase}-${Date.now().toString(36)}`;

    const { data: funnel, error: funnelError } = await supabase
      .from("funnels")
      .insert({ user_id: user.id, name: template.name, slug })
      .select()
      .single();

    if (funnelError) {
      return NextResponse.json({ error: "Failed to create funnel" }, { status: 500 });
    }

    const { error: pageError } = await supabase
      .from("pages")
      .insert({
        funnel_id: funnel.id,
        slug: "main",
        title: "Main Page",
        content: blocks,
        settings,
        order: 0,
      });

    if (pageError) {
      return NextResponse.json({ error: "Failed to create page" }, { status: 500 });
    }

    return NextResponse.json({ redirect: `/dashboard/funnels/${funnel.id}/edit` });
  } catch (err) {
    console.error("Template use error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
