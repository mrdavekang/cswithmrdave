BEGIN;

CREATE TABLE public.computing_test_sittings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_key text NOT NULL CHECK (test_key ~ '^[a-z0-9-]{1,50}$'),
  class_name text NOT NULL CHECK (char_length(btrim(class_name)) BETWEEN 1 AND 60),
  is_open boolean NOT NULL DEFAULT false
);

CREATE TABLE public.computing_test_responses (
  receipt uuid PRIMARY KEY,
  sitting_id uuid NOT NULL REFERENCES public.computing_test_sittings(id),
  student_name text NOT NULL CHECK (
    student_name IN ('Demo Student A', 'Demo Student B', 'Demo Student C')
  ),
  answers jsonb NOT NULL CHECK (
    jsonb_typeof(answers) = 'object'
    AND octet_length(answers::text) <= 40000
  ),
  submitted_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX computing_test_responses_sitting_idx
  ON public.computing_test_responses(sitting_id, submitted_at DESC);

ALTER TABLE public.computing_test_sittings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.computing_test_responses ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.computing_test_sittings, public.computing_test_responses
  FROM PUBLIC, anon, authenticated;
GRANT SELECT (id, test_key, class_name, is_open)
  ON public.computing_test_sittings TO anon;
GRANT INSERT (receipt, sitting_id, student_name, answers)
  ON public.computing_test_responses TO anon;

CREATE POLICY students_find_open_computing_test
  ON public.computing_test_sittings FOR SELECT TO anon
  USING (is_open);

CREATE POLICY students_submit_to_open_computing_test
  ON public.computing_test_responses FOR INSERT TO anon
  WITH CHECK (sitting_id = '6d476074-0dd4-48b4-874e-ede95cc603f1'::uuid AND EXISTS (
    SELECT 1 FROM public.computing_test_sittings AS sitting
    WHERE sitting.id = sitting_id AND sitting.is_open IS TRUE
      AND sitting.test_key = 'computing-pilot-v1'
  ));

INSERT INTO public.computing_test_sittings (id, test_key, class_name, is_open)
  VALUES ('6d476074-0dd4-48b4-874e-ede95cc603f1', 'computing-pilot-v1', 'Demo Class', true);

COMMIT;
